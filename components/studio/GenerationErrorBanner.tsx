'use client';

import * as React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface GenerationErrorBannerProps {
  error: string | null;
  onDismiss?: () => void;
}

export function GenerationErrorBanner({
  error,
  onDismiss,
}: GenerationErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="w-full p-3 rounded-[10px] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] flex items-start justify-between gap-2.5 text-xs text-[#EF4444] animate-in fade-in duration-200">
      <div className="flex items-start gap-2 min-w-0">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span className="leading-relaxed font-medium">{error}</span>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 hover:bg-red-500/15 rounded text-[#EF4444] cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
