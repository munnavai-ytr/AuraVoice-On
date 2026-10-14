import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const errorParam = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle provider or OAuth errors
  if (errorParam) {
    console.error('OAuth provider error:', errorParam, errorDescription);
    return NextResponse.redirect(
      new URL('/login?error=auth_callback_failed', requestUrl.origin)
    );
  }

  // Destination resolution
  const rawNext = requestUrl.searchParams.get('next') ?? requestUrl.searchParams.get('redirectTo');
  let next = rawNext;

  // Map /dashboard to /studio since (dashboard) is a route group
  if (!next || next === '/dashboard') {
    next = '/studio';
  } else if (!next.startsWith('/') || next.startsWith('//')) {
    // Prevent open redirect vulnerabilities
    next = '/studio';
  }

  if (code) {
    try {
      const cookieStore = await cookies();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        // If no explicit destination was requested, check onboarding status
        if (!rawNext) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_complete')
            .eq('id', data.user.id)
            .single();

          if (profile && profile.onboarding_complete === false) {
            return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
          }
        }

        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    } catch (err) {
      console.error('OAuth callback code exchange failed:', err);
    }
  }

  // Auth error — redirect to login with error message
  return NextResponse.redirect(
    new URL('/login?error=auth_callback_failed', requestUrl.origin)
  );
}

