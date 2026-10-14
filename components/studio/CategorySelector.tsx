'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const CATEGORIES = ['YouTube', 'TikTok', 'Ads', 'Story', 'Education'];

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="flex items-center gap-2 w-full text-xs select-none">
      <span className="font-semibold text-[#8899B4] shrink-0">Category:</span>
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const isActive =
            selectedCategory.toLowerCase() === cat.toLowerCase();

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat.toLowerCase())}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 border',
                isActive
                  ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-sm shadow-indigo-500/20'
                  : 'bg-[#1A2235] text-[#8899B4] border-[#2D3F56] hover:bg-[#2D3F56] hover:text-[#F0F4FF]'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
