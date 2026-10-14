'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EMOTION_TAGS = [
  'excited',
  'sad',
  'angry',
  'whisper',
  'cheerful',
  'serious',
  'nervous',
  'dramatic',
  'friendly',
  'professional',
];

interface EmotionTagBarProps {
  activeTags: string[];
  onTagClick: (tag: string) => void;
  onClearTags: () => void;
}

export function EmotionTagBar({
  activeTags,
  onTagClick,
  onClearTags,
}: EmotionTagBarProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center justify-between gap-3 py-1.5 w-full select-none">
      {/* Scrollable Emotion Tags Toolbar */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
      >
        {EMOTION_TAGS.map((tag) => {
          const isSelected = activeTags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className={cn(
                'h-[28px] px-3 rounded-full text-xs font-medium shrink-0 transition-all duration-150 cursor-pointer flex items-center gap-1.5 border',
                isSelected
                  ? 'bg-[rgba(99,102,241,0.15)] border-[#6366F1] text-[#818CF8] font-semibold shadow-sm shadow-indigo-500/20'
                  : 'bg-[#1A2235] border-[#2D3F56] text-[#8899B4] hover:bg-[#2D3F56] hover:text-[#F0F4FF]'
              )}
            >
              <span>{tag}</span>
            </button>
          );
        })}
      </div>

      {/* Clear All Tags Button */}
      {activeTags.length > 0 && (
        <button
          type="button"
          onClick={onClearTags}
          className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-[#8899B4] hover:text-[#EF4444] px-2 py-1 rounded-md hover:bg-[#1A2235] transition-colors cursor-pointer"
        >
          <X className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
}
