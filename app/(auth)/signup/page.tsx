import * as React from 'react';
import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account — Vocalis AI',
  description: 'Create an account to start cloning your voice with Vocalis AI.',
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <React.Suspense
        fallback={
          <div className="w-full flex items-center justify-center p-8 text-sm text-[var(--text-3)]">
            Loading...
          </div>
        }
      >
        <SignupForm />
      </React.Suspense>
    </AuthLayout>
  );
}
