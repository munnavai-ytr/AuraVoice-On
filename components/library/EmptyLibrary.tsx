'use client';

import * as React from 'react';
import Link from 'next/link';
import { AudioLines, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function EmptyLibrary() {
  return (
    <div className="w-full py-16 sm:py-24 px-4 flex flex-col items-center justify-center text-center select-none">
      <div className="w-20 h-20 rounded-2xl bg-[#111827] border border-[#1E293B] flex items-center justify-center mb-5 shadow-inner">
        <AudioLines className="w-12 h-12 text-[#2D3F56]" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-[#F0F4FF] mb-2 tracking-tight">
        No audio generated yet
      </h3>

      <p className="text-sm text-[#8899B4] max-w-sm mb-8 leading-relaxed">
        Head to Studio to create your first AI-voiced audio with your personalized voice clone.
      </p>

      <Link href="/studio">
        <Button variant="primary" size="lg" className="h-[48px] px-6">
          <span>Open Studio</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
