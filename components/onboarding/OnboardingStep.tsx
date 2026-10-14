'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Mic,
  Key,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OnboardingStepProps {
  step: 1 | 2 | 3;
  onNext: () => void;
  onSkip?: () => void;
  apiKeyInput: string;
  setApiKeyInput: (val: string) => void;
  onSaveKey: () => Promise<void>;
  isSavingKey: boolean;
  hasKey: boolean;
  hasVoice: boolean;
  isCompleting: boolean;
}

export function OnboardingStep({
  step,
  onNext,
  onSkip,
  apiKeyInput,
  setApiKeyInput,
  onSaveKey,
  isSavingKey,
  hasKey,
  hasVoice,
  isCompleting,
}: OnboardingStepProps) {
  if (step === 1) {
    return (
      <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
          <Key className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Connect your ElevenLabs API Key
        </h2>
        <p className="text-sm text-[#8899B4] mb-6 leading-relaxed">
          Vocalis AI works seamlessly with ElevenLabs. Bring your own free or paid API key to unlock custom voice cloning, emotional synthesis, and unlimited generation.
        </p>

        <div className="space-y-4 mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            ElevenLabs API Key
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="xi-... or paste your ElevenLabs key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-[#111827] border border-[#1E293B] focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Stored encrypted in your private profile
            </span>
            <a
              href="https://elevenlabs.io/app/settings/api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Get free key <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={async () => {
              if (apiKeyInput.trim()) {
                await onSaveKey();
              }
              onNext();
            }}
            isLoading={isSavingKey}
            className="flex-1"
          >
            {hasKey ? 'Key Connected — Next' : 'Save & Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {onSkip && (
            <Button
              variant="outline"
              onClick={onSkip}
              className="sm:w-auto"
            >
              Skip for now
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
          <Radio className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Clone Your Voice
        </h2>
        <p className="text-sm text-[#8899B4] mb-6 leading-relaxed">
          Record or upload a short 60-second audio clip of your voice. Vocalis will instantly create your personalized voice model with 99% pitch & cadence fidelity.
        </p>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1E293B] mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {hasVoice ? 'Voice Already Configured' : 'Voice Studio Cloner'}
                </p>
                <p className="text-xs text-[#8899B4]">
                  {hasVoice ? 'Your voice is ready for generation' : 'One-click microphone recording or audio file upload'}
                </p>
              </div>
            </div>
            {hasVoice && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Ready
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/voice-studio" className="flex-1">
            <Button className="w-full">
              Go to Voice Cloner
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={onNext}
            className="sm:w-auto"
          >
            {hasVoice ? 'Next' : 'Continue without custom voice'}
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Complete & Ready
  return (
    <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-xl text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-6">
        <Sparkles className="w-8 h-8 text-indigo-400" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        You are all set!
      </h2>
      <p className="text-sm text-[#8899B4] mb-8 max-w-md mx-auto leading-relaxed">
        Your Vocalis AI workspace is ready. Head to the Studio to write scripts, select emotional inflections, and generate lifelike voiceovers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1E293B]">
          <p className="text-xs font-semibold text-white mb-1">Emotion Tags</p>
          <p className="text-[11px] text-[#8899B4]">Whisper, shouting, excitement, sad tags in scripts</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1E293B]">
          <p className="text-xs font-semibold text-white mb-1">Community Voices</p>
          <p className="text-[11px] text-[#8899B4]">Access 20+ creator voices ready to clone</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1E293B]">
          <p className="text-xs font-semibold text-white mb-1">Audio Waveforms</p>
          <p className="text-[11px] text-[#8899B4]">Download broadcast-quality MP3 audio</p>
        </div>
      </div>

      <Button
        onClick={onNext}
        isLoading={isCompleting}
        className="w-full py-3.5 text-base shadow-lg shadow-indigo-600/30"
      >
        Launch Vocalis Studio
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}
