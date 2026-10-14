'use client';

import * as React from 'react';
import { FileAudio, Upload, Brain, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UploadProgressProps {
  currentStep: 1 | 2 | 3 | 4;
  progressPercent: number; // 0 to 100
  error: string | null;
  onRetry?: () => void;
}

const STEPS = [
  { step: 1, label: 'Preparing audio...', icon: FileAudio, color: 'text-[#6366F1]' },
  { step: 2, label: 'Uploading to ElevenLabs...', icon: Upload, color: 'text-[#6366F1]' },
  { step: 3, label: 'Training your voice model...', icon: Brain, color: 'text-[#8B5CF6]' },
  { step: 4, label: 'Finalizing...', icon: Sparkles, color: 'text-[#6366F1]' },
];

export function UploadProgress({
  currentStep,
  progressPercent,
  error,
  onRetry,
}: UploadProgressProps) {
  const activeStepConfig = STEPS.find((s) => s.step === currentStep) || STEPS[0];
  const StepIcon = activeStepConfig.icon;

  if (error) {
    return (
      <div className="w-full max-w-[440px] mx-auto p-8 rounded-2xl bg-[#0D1117] border border-[#1E293B] text-center my-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
        </div>
        <h3 className="text-xl font-bold text-[#F0F4FF] mb-2">Voice Cloning Failed</h3>
        <p className="text-sm text-[#8899B4] mb-6 leading-relaxed whitespace-pre-line text-left">{error}</p>
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry} className="mx-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] mx-auto p-8 sm:p-10 rounded-2xl bg-[#0D1117] border border-[#1E293B] text-center my-8 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Step Icon with pulsing container */}
      <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#111827] border border-[#2D3F56] flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-500/10">
        <StepIcon className={`w-8 h-8 ${activeStepConfig.color} animate-pulse`} />
      </div>

      {/* Step Label */}
      <h3 className="relative z-10 font-medium text-[15px] text-[#8899B4] mb-6">
        {activeStepConfig.label}
      </h3>

      {/* Progress Bar */}
      <div className="relative z-10 w-full h-[6px] rounded-[3px] bg-[#1A2235] overflow-hidden mb-3">
        <div
          className="h-full rounded-[3px] transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(Math.max(progressPercent, 5), 100)}%`,
            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            boxShadow: '0 0 12px rgba(99,102,241,0.5)',
          }}
        />
      </div>

      {/* Percentage text */}
      <div className="relative z-10 flex items-center justify-between text-xs text-[#4B6080] font-mono">
        <span>Step {currentStep} of 4</span>
        <span>{Math.round(progressPercent)}%</span>
      </div>

      {/* Small informative detail */}
      <p className="relative z-10 text-xs text-[#4B6080] mt-6">
        Neural synthesis calibrates pitch, cadence, and tone consistency.
      </p>
    </div>
  );
}
