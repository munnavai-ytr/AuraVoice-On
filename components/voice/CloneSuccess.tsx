'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, Mic, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CloneSuccessProps {
  voiceName?: string;
  voiceId?: string;
}

export function CloneSuccess({ voiceName = 'My Voice' }: CloneSuccessProps) {
  return (
    <div className="w-full max-w-[400px] mx-auto py-8 text-center flex flex-col items-center">
      {/* Animated Green Checkmark */}
      <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] border-2 border-[rgba(16,185,129,0.4)] flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 animate-in zoom-in-50 duration-500">
        <Check className="w-8 h-8 text-[#10B981] stroke-[2.5]" />
      </div>

      {/* Title */}
      <h2 className="font-bold text-2xl text-[#F0F4FF] tracking-tight mb-2">
        Your AI Voice is Ready!
      </h2>

      {/* Subtitle */}
      <p className="font-normal text-sm text-[#8899B4] mb-8 leading-relaxed max-w-[340px]">
        You can now generate unlimited content with your personal voice clone.
      </p>

      {/* Voice Result Card */}
      <div className="w-full p-4 mb-8 rounded-[12px] bg-[#111827] border border-[#2D3F56] text-left flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <Mic className="w-5 h-5 text-[#6366F1]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#F0F4FF]">{voiceName}</h4>
            <p className="text-xs text-[#8899B4]">Created just now</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#818CF8] bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          <Activity className="w-3.5 h-3.5" />
          <span>Active</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Link href="/studio" className="w-full">
          <Button variant="primary" size="lg" className="w-full h-[48px]">
            Open Studio
          </Button>
        </Link>

        <Link href="/library" className="w-full">
          <Button variant="ghost" size="lg" className="w-full h-[48px] border border-[#1E293B]">
            View Library
          </Button>
        </Link>
      </div>
    </div>
  );
}
