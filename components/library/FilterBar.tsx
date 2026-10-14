'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const LIBRARY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'ads', label: 'Ads' },
  { id: 'storytelling', label: 'Storytelling' },
  { id: 'education', label: 'Education' },
];

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 select-none">
      {LIBRARY_FILTERS.map((chip) => {
        const isActive = activeFilter.toLowerCase() === chip.id.toLowerCase();

        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onFilterChange(chip.id)}
            className={cn(
              'h-[32px] px-3.5 rounded-full text-[13px] font-medium shrink-0 transition-all duration-150 cursor-pointer border',
              isActive
                ? 'bg-[rgba(99,102,241,0.12)] border-[#6366F1] text-[#818CF8] font-semibold shadow-sm'
                : 'bg-[#111827] border-[#1E293B] text-[#8899B4] hover:bg-[#1A2235] hover:text-[#F0F4FF]'
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
