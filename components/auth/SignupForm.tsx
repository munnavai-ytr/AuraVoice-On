'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Profile } from '@/types';

export function SignupForm() {
  const router = useRouter();
  const { setUser, setProfile } = useAppStore();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  // Field validation errors
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const validate = (): boolean => {
    let isValid = true;
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);

    if (!fullName.trim()) {
      setNameError('Full name is required');
      isValid = false;
    }

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);

        // Ensure profile exists in profiles table
        const profilePayload: Partial<Profile> = {
          id: data.user.id,
          full_name: fullName.trim(),
          email: email.trim(),
          onboarding_complete: false,
        };

        const { data: upsertedProfile } = await supabase
          .from('profiles')
          .upsert(profilePayload)
          .select()
          .single();

        if (upsertedProfile) {
          setProfile(upsertedProfile as Profile);
        }

        // If session was created right away (email confirmation disabled in Supabase),
        // redirect directly to onboarding /voice-studio
        if (data.session) {
          router.push('/voice-studio');
          return;
        }

        // If email confirmation is required:
        setSuccessNotice(
          'Account created! If confirmation is enabled on your Supabase project, check your inbox.'
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to create account. Please verify details and try again.';
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
        err instanceof Error ? err.message : 'Google sign-up failed. Please try again.';
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
        <Link
          href="/login"
          className="flex-1 pb-3 text-sm font-medium text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors cursor-pointer text-center"
        >
          Sign In
        </Link>
        <button
          type="button"
          className="flex-1 pb-3 text-sm font-semibold text-[var(--text-1)] border-b-2 border-[var(--indigo)] cursor-pointer text-center"
        >
          Create Account
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-[10px] bg-red-500/10 border border-red-500/20 text-[var(--error)] text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Success notice */}
      {successNotice && (
        <div className="mb-4 p-3 rounded-[10px] bg-emerald-500/10 border border-emerald-500/20 text-[var(--success)] text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{successNotice}</span>
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

      {/* Sign Up Form */}
      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <Input
          type="text"
          label="Full Name"
          placeholder="e.g. Alex Rivera"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={nameError || undefined}
          autoComplete="name"
          required
        />

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
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError || undefined}
          autoComplete="new-password"
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

        <p className="text-[12px] leading-relaxed text-[var(--text-3)] pt-1 select-none">
          By creating an account, you agree to our{' '}
          <span className="text-[var(--text-2)] hover:underline cursor-pointer">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="text-[var(--text-2)] hover:underline cursor-pointer">
            Privacy Policy
          </span>
          .
        </p>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* Bottom Switch Link */}
      <div className="mt-6 text-center text-xs text-[var(--text-2)]">
        Already have an account?{' '}
        <Link href="/login" className="text-[var(--indigo)] hover:underline font-semibold ml-1">
          Sign in
        </Link>
      </div>
    </div>
  );
}
