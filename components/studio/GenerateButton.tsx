'use client';

import * as React from 'react';
import { AudioLines, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
  status: 'idle' | 'generating' | 'success' | 'error';
  isDisabled: boolean;
  onClick: () => void;
  className?: string;
}

export function GenerateButton({
  status,
  isDisabled,
  onClick,
  className,
}: GenerateButtonProps) {
  const [secondsElapsed, setSecondsElapsed] = React.useState(0);

  React.useEffect(() => {
    if (status !== 'generating') {
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  if (status === 'success') {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'w-full h-[42px] sm:h-[48px] rounded-[10px] sm:rounded-[12px] bg-[#10B981] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 select-none animate-in zoom-in-95 duration-200',
          className
        )}
      >
        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        <span>Generated!</span>
      </button>
    );
  }

  if (status === 'generating') {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'w-full h-[42px] sm:h-[48px] rounded-[10px] sm:rounded-[12px] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 cursor-wait select-none shadow-lg shadow-indigo-500/25',
          className
        )}
        style={{
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        }}
      >
        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        <span>Generating audio ({secondsElapsed}s)...</span>
      </button>
    );
  }

  if (isDisabled) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'w-full h-[42px] sm:h-[48px] rounded-[10px] sm:rounded-[12px] bg-[#1A2235] text-[#4B6080] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed select-none border border-[#1E293B]',
          className
        )}
      >
        <AudioLines className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Generate Audio</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full h-[42px] sm:h-[48px] rounded-[10px] sm:rounded-[12px] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_4px_24px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_32px_rgba(99,102,241,0.45)] hover:scale-[1.01] active:scale-[0.98] select-none',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      }}
    >
      <AudioLines className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>Generate Audio</span>
    </button>
  );
}
