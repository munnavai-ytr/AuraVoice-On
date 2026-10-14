import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.user) {
        // Fetch profile to verify onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.onboarding_complete === true) {
          return NextResponse.redirect(`${origin}/studio`);
        }

        return NextResponse.redirect(`${origin}/voice-studio`);
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}
