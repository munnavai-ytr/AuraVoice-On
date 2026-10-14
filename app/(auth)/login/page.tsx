import * as React from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Vocalis AI',
  description: 'Sign in to Vocalis AI to clone your voice and generate audio.',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <React.Suspense
        fallback={
          <div className="w-full flex items-center justify-center p-8 text-sm text-[var(--text-3)]">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>
    </AuthLayout>
  );
}
