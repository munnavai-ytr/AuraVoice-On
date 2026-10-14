'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Profile } from '@/types';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/studio';

  const { setUser, setProfile } = useAppStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Form field errors
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const validate = (): boolean => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          const profile = profileData as Profile;
          setProfile(profile);
          if (profile.onboarding_complete === false) {
            router.push('/voice-studio');
            return;
          }
        }
        router.push(redirectTo);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please verify your credentials and try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      setErrorMessage(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px] mx-auto flex flex-col">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[var(--indigo)] flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-[var(--text-1)]">
          Vocalis AI
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-[var(--border-base)] mb-6">
        <button
          type="button"
          className="flex-1 pb-3 text-sm font-semibold text-[var(--text-1)] border-b-2 border-[var(--indigo)] cursor-pointer text-center"
        >
          Sign In
        </button>
        <Link
          href="/signup"
          className="flex-1 pb-3 text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors cursor-pointer text-center"
        >
          Create Account
        </Link>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-[10px] bg-red-500/10 border border-red-500/20 text-[var(--error)] text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Success alert */}
      {successMessage && (
        <div className="mb-4 p-3 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 text-[var(--success)] text-xs flex items-start gap-2.5">
          <span className="leading-relaxed">{successMessage}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="w-full h-[44px] min-h-[44px] flex items-center justify-center gap-3 bg-white hover:bg-[#F1F5F9] text-[#1a1a1a] font-medium text-sm rounded-[10px] transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-[var(--border-base)]" />
        <span className="px-3 text-xs uppercase tracking-wider text-[var(--text-3)]">or</span>
        <div className="flex-1 h-px bg-[var(--border-base)]" />
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
        <Input
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError || undefined}
          autoComplete="email"
          required
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError || undefined}
          autoComplete="current-password"
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 cursor-pointer focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-[var(--text-3)] hover:text-[var(--text-1)]" />
              ) : (
                <Eye className="w-4 h-4 text-[var(--text-3)] hover:text-[var(--text-1)]" />
              )}
            </button>
          }
        />

        {/* Row: Remember me + Forgot password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-[var(--text-2)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-base)] bg-[var(--bg-elevated)] accent-[var(--indigo)] cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() =>
              setErrorMessage('Password reset functionality will be sent to your registered email.')
            }
            className="text-[var(--indigo)] hover:underline font-medium cursor-pointer"
          >
            Forgot password? →
          </button>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Bottom Switch Link */}
      <div className="mt-6 text-center text-xs text-[var(--text-2)]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--indigo)] hover:underline font-semibold ml-1">
          Create one
        </Link>
      </div>
    </div>
  );
}
