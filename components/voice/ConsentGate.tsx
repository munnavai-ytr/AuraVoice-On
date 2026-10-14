'use client';

import * as React from 'react';
import { Shield, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentGateProps {
  onConsentAccepted: () => void;
}

export function ConsentGate({ onConsentAccepted }: ConsentGateProps) {
  const [certifyVoice, setCertifyVoice] = React.useState(false);
  const [authorizeModel, setAuthorizeModel] = React.useState(false);

  const isEnabled = certifyVoice && authorizeModel;

  return (
    <div className="w-full max-w-[520px] mx-auto py-6 sm:py-10 px-4">
      <div className="flex flex-col items-center text-center">
        {/* Top Amber Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/10">
          <Shield className="w-8 h-8 text-[#F59E0B]" />
        </div>

        {/* Title */}
        <h1 className="font-bold text-2xl sm:text-[24px] text-[#F0F4FF] tracking-tight mb-4">
          Before You Record
        </h1>

        {/* Warning Box */}
        <div className="w-full mb-6 p-4 rounded-[12px] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] text-left flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <p className="text-[13px] leading-relaxed text-[#EF4444] font-medium">
            Cloning another person&apos;s voice without their explicit permission is strictly
            prohibited and may violate laws.
          </p>
        </div>

        {/* Checkbox 1 */}
        <div
          onClick={() => setCertifyVoice(!certifyVoice)}
          className={cn(
            'w-full flex items-start gap-3 p-4 mb-2 rounded-[10px] bg-[#111827] border transition-all duration-200 cursor-pointer select-none text-left',
            certifyVoice ? 'border-indigo-500/50 bg-[#141d30]' : 'border-[#1E293B] hover:border-[#2D3F56]'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 min-w-8 min-h-8 rounded-[8px] flex items-center justify-center transition-all duration-200 shrink-0 mt-0.5',
              certifyVoice
                ? 'bg-[#6366F1] border-transparent shadow-sm shadow-indigo-500/30'
                : 'border-2 border-[#2D3F56] bg-transparent'
            )}
          >
            {certifyVoice && <Check className="w-5 h-5 text-white stroke-[2.5]" />}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[14px] text-[#F0F4FF] leading-snug">
              I certify this is my own voice
            </span>
            <span className="font-normal text-[13px] text-[#8899B4] leading-relaxed mt-1">
              I confirm this recording is of my own live voice and not a recording of another
              person.
            </span>
          </div>
        </div>

        {/* Checkbox 2 */}
        <div
          onClick={() => setAuthorizeModel(!authorizeModel)}
          className={cn(
            'w-full flex items-start gap-3 p-4 mb-6 rounded-[10px] bg-[#111827] border transition-all duration-200 cursor-pointer select-none text-left',
            authorizeModel ? 'border-indigo-500/50 bg-[#141d30]' : 'border-[#1E293B] hover:border-[#2D3F56]'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 min-w-8 min-h-8 rounded-[8px] flex items-center justify-center transition-all duration-200 shrink-0 mt-0.5',
              authorizeModel
                ? 'bg-[#6366F1] border-transparent shadow-sm shadow-indigo-500/30'
                : 'border-2 border-[#2D3F56] bg-transparent'
            )}
          >
            {authorizeModel && <Check className="w-5 h-5 text-white stroke-[2.5]" />}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-[14px] text-[#F0F4FF] leading-snug">
              I authorize voice model creation
            </span>
            <span className="font-normal text-[13px] text-[#8899B4] leading-relaxed mt-1">
              I authorize Vocalis AI to create a personal AI voice model from this recording for my
              content use.
            </span>
          </div>
        </div>

        {/* Paid Plan Warning Card */}
        <div className="w-full max-w-[560px] mx-auto mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-left">
          <p className="text-amber-400 text-xs font-semibold mb-1">⚠️ ElevenLabs Paid Plan Required</p>
          <p className="text-amber-300/80 text-xs leading-relaxed">
            Voice cloning করতে ElevenLabs-এর <strong>Starter plan ($5/month)</strong> বা তার উপরে দরকার।
            Free trial-এ voice cloning <strong>কাজ করবে না</strong>।
            Settings-এ গিয়ে আপনার paid API key save করুন।
          </p>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => {
            if (isEnabled) {
              onConsentAccepted();
            }
          }}
          disabled={!isEnabled}
          className={cn(
            'w-full h-[52px] rounded-[12px] font-semibold text-[15px] transition-all duration-300 flex items-center justify-center cursor-pointer select-none',
            isEnabled
              ? 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-[0_0_24px_rgba(99,102,241,0.3)] active:scale-[0.99]'
              : 'bg-[#1A2235] text-[#4B6080] cursor-not-allowed'
          )}
        >
          Start Recording
        </button>
      </div>
    </div>
  );
}
