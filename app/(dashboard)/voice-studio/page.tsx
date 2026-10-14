'use client';

import * as React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';
import { cloneVoice, deleteVoice } from '@/lib/elevenlabs';
import { ConsentGate } from '@/components/voice/ConsentGate';
import { RecordingStudio } from '@/components/voice/RecordingStudio';
import { UploadProgress } from '@/components/voice/UploadProgress';
import { CloneSuccess } from '@/components/voice/CloneSuccess';
import { VoiceCard } from '@/components/voice/VoiceCard';
import type { VoiceTemplate } from '@/types';

type StudioState = 'consent' | 'recording' | 'processing' | 'success' | 'existing';

export default function VoiceStudioPage() {
  const { user, profile, setProfile } = useAppStore();

  const [stateOverride, setStateOverride] = React.useState<StudioState | null>(null);
  const [createdVoiceId, setCreatedVoiceId] = React.useState<string | null>(null);
  const [voiceTemplate, setVoiceTemplate] = React.useState<VoiceTemplate | null>(null);

  // Active voice ID is either from current creation or existing profile
  const activeVoiceId = createdVoiceId || profile?.user_voice_id;

  // Determine current active state
  const currentState: StudioState =
    stateOverride ?? (profile?.user_voice_id ? 'existing' : 'consent');

  // Processing state trackers
  const [processingStep, setProcessingStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [cloneError, setCloneError] = React.useState<string | null>(null);
  const [lastAudioBlob, setLastAudioBlob] = React.useState<Blob | null>(null);

  // Fetch corresponding voice_template if activeVoiceId is present
  React.useEffect(() => {
    if (!activeVoiceId) return;

    let isMounted = true;
    const fetchTemplate = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('voice_templates')
          .select('*')
          .eq('elevenlabs_voice_id', activeVoiceId)
          .single();

        if (data && isMounted) {
          setVoiceTemplate(data as VoiceTemplate);
        }
      } catch {
        // Template record might not exist or already be deleted
      }
    };

    fetchTemplate();

    return () => {
      isMounted = false;
    };
  }, [activeVoiceId]);

  // Handle clone voice execution
  const handleCloneVoice = async (audioBlob: Blob) => {
    setLastAudioBlob(audioBlob);
    setStateOverride('processing');
    setCloneError(null);
    setProcessingStep(1);
    setProgressPercent(10);

    const apiKey = profile?.custom_api_key || '';
    const userId = user?.id || 'anon';
    const voiceName = profile?.full_name ? `${profile.full_name}'s Voice` : 'My Voice';

    try {
      // Step 1: Preparing audio
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessingStep(2);
      setProgressPercent(25);

      // Step 2 & 3: Uploading & training with ElevenLabs
      const cloneResult = await cloneVoice({
        apiKey,
        audioBlob,
        voiceName,
        userId,
        onProgress: (uploadPercent) => {
          // Map upload progress from 25% to 65%
          const mapped = 25 + Math.round((uploadPercent / 100) * 40);
          setProgressPercent(mapped);
          if (uploadPercent >= 95) {
            setProcessingStep(3);
          }
        },
      });

      // Step 3: Neural calibration simulation
      setProcessingStep(3);
      setProgressPercent(75);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProgressPercent(90);

      // Step 4: Finalizing records in Supabase
      setProcessingStep(4);
      setProgressPercent(95);

      const voiceId = cloneResult.voice_id;
      setCreatedVoiceId(voiceId);

      // Update Supabase profiles and voice_templates
      const supabase = createClient();

      if (user?.id) {
        // a. Update profiles
        await supabase
          .from('profiles')
          .update({
            user_voice_id: voiceId,
            onboarding_complete: true,
          })
          .eq('id', user.id);

        // b. Insert into voice_templates
        const { data: newTemplate } = await supabase
          .from('voice_templates')
          .insert({
            user_id: user.id,
            voice_name: voiceName,
            elevenlabs_voice_id: voiceId,
            is_public: false,
            category: 'creator',
          })
          .select()
          .single();

        if (newTemplate) {
          setVoiceTemplate(newTemplate as VoiceTemplate);
        }

        // c. Update Zustand store
        if (profile) {
          setProfile({
            ...profile,
            user_voice_id: voiceId,
            onboarding_complete: true,
          });
        }
      }

      setProgressPercent(100);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStateOverride('success');
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : 'Failed to clone voice. Please try again.';

      if (
        msg.toLowerCase().includes('subscription') ||
        msg.toLowerCase().includes('instant voice cloning') ||
        msg.toLowerCase().includes('plan') ||
        msg.toLowerCase().includes('does not include')
      ) {
        msg = `🔒 Voice Cloning requires a paid ElevenLabs plan.\n\nFree trial-এ voice cloning হয় না।\n\n✅ কী করবেন:\n1. elevenlabs.io তে যান\n2. Starter Plan ($5/month) বা তার উপরে upgrade করুন\n3. নতুন API key তৈরি করে Settings-এ save করুন\n4. আবার চেষ্টা করুন\n\n💡 Starter Plan-এ যা পাবেন:\n• Voice Cloning ✓\n• ৩০,০০০ characters/month\n• Commercial license ✓`;
      } else if (msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('character limit') || msg.toLowerCase().includes('limit exceeded')) {
        msg = '⚠️ আপনার ElevenLabs এর monthly character limit শেষ হয়ে গেছে। পরের মাসে reset হবে অথবা plan upgrade করুন।';
      } else if (msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('invalid')) {
        msg = '🔑 ElevenLabs API Key সঠিক নয়। Settings এ গিয়ে আপনার API key আবার check করুন।';
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
        msg = '🌐 Network সমস্যা। Internet connection চেক করে আবার চেষ্টা করুন।';
      }

      setCloneError(msg);
    }
  };

  // Re-clone voice handler (resets to State 1)
  const handleReclone = () => {
    setStateOverride('consent');
  };

  // Delete voice model handler
  const handleDeleteVoice = async (voiceId: string) => {
    const apiKey = profile?.custom_api_key || '';
    try {
      await deleteVoice({ apiKey, voiceId });
    } catch (err) {
      console.warn('ElevenLabs remote delete notice:', err);
    }

    // Clear local Supabase records
    const supabase = createClient();
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ user_voice_id: null })
        .eq('id', user.id);

      await supabase
        .from('voice_templates')
        .delete()
        .eq('elevenlabs_voice_id', voiceId);

      if (profile) {
        setProfile({
          ...profile,
          user_voice_id: null,
        });
      }
    }

    setCreatedVoiceId(null);
    setVoiceTemplate(null);
    setStateOverride('consent');
  };

  // Toggle privacy handler
  const handleTogglePrivacy = async (isPublic: boolean) => {
    if (!activeVoiceId) return;
    const supabase = createClient();
    await supabase
      .from('voice_templates')
      .update({ is_public: isPublic })
      .eq('elevenlabs_voice_id', activeVoiceId);

    if (voiceTemplate) {
      setVoiceTemplate({ ...voiceTemplate, is_public: isPublic });
    }
  };

  return (
    <div className="py-2 sm:py-4">
      {/* State 1: Consent Gate */}
      {currentState === 'consent' && (
        <ConsentGate onConsentAccepted={() => setStateOverride('recording')} />
      )}

      {/* State 2: Recording Studio */}
      {currentState === 'recording' && (
        <RecordingStudio
          onRecordingComplete={handleCloneVoice}
          onCancel={() => {
            if (profile?.user_voice_id) {
              setStateOverride('existing');
            } else {
              setStateOverride('consent');
            }
          }}
        />
      )}

      {/* State 3: Upload & Processing */}
      {currentState === 'processing' && (
        <UploadProgress
          currentStep={processingStep}
          progressPercent={progressPercent}
          error={cloneError}
          onRetry={() => {
            if (lastAudioBlob) {
              handleCloneVoice(lastAudioBlob);
            } else {
              setStateOverride('recording');
            }
          }}
        />
      )}

      {/* State 4: Success Screen */}
      {currentState === 'success' && (
        <CloneSuccess
          voiceName={voiceTemplate?.voice_name || 'My Voice'}
          voiceId={activeVoiceId || undefined}
        />
      )}

      {/* Existing Voice Management View */}
      {currentState === 'existing' && activeVoiceId && (
        <div className="space-y-6">
          <div className="pb-3 border-b border-[#1E293B]">
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#F0F4FF]">
              My Voice Studio
            </h2>
            <p className="text-sm text-[#8899B4] mt-0.5">
              Manage your active neural voice model, test synthesis, or calibrate a new sample.
            </p>
          </div>

          <VoiceCard
            voiceId={activeVoiceId}
            voiceTemplate={voiceTemplate}
            onReclone={handleReclone}
            onDelete={handleDeleteVoice}
            onTogglePrivacy={handleTogglePrivacy}
          />
        </div>
      )}
    </div>
  );
}
