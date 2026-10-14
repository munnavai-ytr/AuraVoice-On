'use client';

import * as React from 'react';
import { Search, ChevronDown, Globe } from 'lucide-react';

interface CommunitySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
}

export function CommunitySearch({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}: CommunitySearchProps) {
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'ads', label: 'Ads' },
    { id: 'storytelling', label: 'Storytelling' },
    { id: 'education', label: 'Education' },
  ];

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
      {/* Search Input */}
      <div className="relative w-full sm:w-[320px]">
        <Search className="w-4 h-4 text-[#4B6080] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search voices..."
          className="w-full h-[40px] pl-10 pr-4 rounded-[10px] bg-[#111827] border border-[#1E293B] text-[#F0F4FF] placeholder-[#4B6080] text-xs outline-none transition-all focus:border-[#6366F1] focus:ring-2 focus:ring-indigo-500/15"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        {/* Category Dropdown */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full sm:w-auto h-[40px] pl-3 pr-8 rounded-[10px] bg-[#111827] border border-[#1E293B] text-xs text-[#8899B4] hover:text-[#F0F4FF] outline-none cursor-pointer appearance-none transition-colors"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#4B6080] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Language Indicator */}
        <div className="flex items-center gap-1.5 h-[40px] px-3 rounded-[10px] bg-[#111827] border border-[#1E293B] text-xs text-[#8899B4] shrink-0">
          <Globe className="w-3.5 h-3.5 text-[#4B6080]" />
          <span>English</span>
        </div>
      </div>
    </div>
  );
}
