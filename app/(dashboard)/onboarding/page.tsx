'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, setProfile } = useAppStore();
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1);
  const [apiKeyInput, setApiKeyInput] = React.useState(profile?.custom_api_key || '');
  const [isSavingKey, setIsSavingKey] = React.useState(false);
  const [isCompleting, setIsCompleting] = React.useState(false);

  const stepTitles = ['API Key', 'Voice Setup', 'Ready'];

  React.useEffect(() => {
    if (profile?.custom_api_key && !apiKeyInput) {
      const timer = setTimeout(() => {
        setApiKeyInput(profile.custom_api_key || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile?.custom_api_key, apiKeyInput]);

  const handleSaveKey = async () => {
    if (!user) return;
    try {
      setIsSavingKey(true);
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            custom_api_key: apiKeyInput.trim(),
            email: user.email,
          },
          { onConflict: 'id' }
        );

      if (!error && profile) {
        setProfile({ ...profile, custom_api_key: apiKeyInput.trim() });
      }
    } catch (err) {
      console.error('Failed to save API key in onboarding:', err);
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!user) {
      router.push('/studio');
      return;
    }
    try {
      setIsCompleting(true);
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', user.id);

      if (!error && profile) {
        setProfile({ ...profile, onboarding_complete: true });
      }
      router.push('/studio');
    } catch (err) {
      console.error('Error completing onboarding:', err);
      router.push('/studio');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else {
      handleCompleteOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={3}
        stepTitles={stepTitles}
      />

      <div className="w-full">
        <OnboardingStep
          step={currentStep}
          onNext={handleNext}
          onSkip={currentStep === 1 ? () => setCurrentStep(2) : undefined}
          apiKeyInput={apiKeyInput}
          setApiKeyInput={setApiKeyInput}
          onSaveKey={handleSaveKey}
          isSavingKey={isSavingKey}
          hasKey={Boolean(profile?.custom_api_key)}
          hasVoice={Boolean(profile?.user_voice_id)}
          isCompleting={isCompleting}
        />
      </div>
    </div>
  );
}
