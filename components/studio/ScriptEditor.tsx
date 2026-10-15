'use client';

import * as React from 'react';
import { Clock, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScriptEditorProps {
  script: string;
  onChange: (value: string) => void;
  maxLength: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
  onEnhance?: () => void;
  isEnhancing?: boolean;
  category?: string;
}

export function ScriptEditor({
  script,
  onChange,
  maxLength,
  textareaRef,
  className,
  onEnhance,
  isEnhancing,
  category,
}: ScriptEditorProps) {
  const charCount = script.length;
  const ratio = maxLength > 0 ? charCount / maxLength : 0;

  // Colors:
  // 0 - 70%: #4B6080
  // 70% - 90%: #F59E0B
  // 90%+: #EF4444
  const counterColor =
    ratio > 0.9 ? 'text-[#EF4444]' : ratio > 0.7 ? 'text-[#F59E0B]' : 'text-[#4B6080]';

  // Average speaking pace ~15 characters per second
  const estimatedSeconds = Math.ceil(charCount / 15);
  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;
  const durationText =
    minutes > 0
      ? `~${minutes}m ${seconds.toString().padStart(2, '0')}s`
      : `~${seconds}s`;

  return (
    <div className={cn('flex flex-col flex-1 w-full min-h-[220px] sm:min-h-[300px]', className)}>
      {onEnhance && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onEnhance}
            disabled={isEnhancing || !script.trim()}
            className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-semibold shadow-md shadow-indigo-500/25 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer select-none"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>✨ AI Enhance</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Script Textarea */}
      <textarea
        ref={textareaRef}
        value={script}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={`Start writing your script here...\nSelect emotion tags above to add expression to your voice.`}
        className="w-full flex-1 min-h-[200px] sm:min-h-[260px] p-3.5 sm:p-5 rounded-[10px] sm:rounded-[12px] bg-[#0D1117] border border-[#1E293B] text-[#F0F4FF] placeholder-[#4B6080] font-normal text-sm sm:text-base leading-[1.6] sm:leading-[1.7] resize-none outline-none transition-all duration-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[rgba(99,102,241,0.12)]"
        spellCheck="true"
      />

      {/* Character Counter & Audio Duration Row */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono pt-2 sm:pt-2.5 px-1 select-none">
        <span className={cn('transition-colors duration-200 font-medium', counterColor)}>
          {charCount.toLocaleString()} / {maxLength.toLocaleString()} characters
        </span>

        <div className="flex items-center gap-1.5 text-[#8899B4]">
          <Clock className="w-3.5 h-3.5 text-[#4B6080]" />
          <span>est. {durationText}</span>
        </div>
      </div>
    </div>
  );
}
