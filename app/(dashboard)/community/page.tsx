'use client';

import * as React from 'react';
import { Radio } from 'lucide-react';
import Link from 'next/link';
import { useCommunity } from '@/hooks/useCommunity';
import { CommunitySearch } from '@/components/community/CommunitySearch';
import { CommunityVoiceCard } from '@/components/community/CommunityVoiceCard';
import { Button } from '@/components/ui/Button';

export default function CommunityPage() {
  const {
    voices,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    playingId,
    playPreview,
  } = useCommunity();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B]">
        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#F0F4FF]">
          Voice Templates
        </h2>
        <p className="text-xs sm:text-sm text-[#8899B4] mt-0.5">
          Discover and use community-shared AI voice models for YouTube, TikTok, and stories.
        </p>
      </div>

      {/* Search and Filters */}
      <CommunitySearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[210px] rounded-[14px] bg-[#0D1117] border border-[#1E293B] animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="h-10 w-2/3 bg-[#111827] rounded-lg" />
              <div className="h-4 w-1/2 bg-[#111827] rounded" />
              <div className="h-10 w-full bg-[#111827] rounded" />
            </div>
          ))}
        </div>
      ) : voices.length === 0 ? (
        <div className="w-full py-16 px-4 rounded-2xl bg-[#0D1117] border border-[#1E293B] text-center flex flex-col items-center justify-center select-none my-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1A2235] flex items-center justify-center mb-4 text-[#8899B4]">
            <Radio className="w-8 h-8 text-[#2D3F56]" />
          </div>
          <h4 className="text-base font-bold text-[#F0F4FF] mb-1">No community voices found</h4>
          <p className="text-xs text-[#8899B4] max-w-xs mb-6 leading-relaxed">
            Be the first to share your cloned voice model with the community in Settings.
          </p>
          <Link href="/settings">
            <Button variant="secondary" size="md">
              Share in Settings
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {voices.map((voice) => (
            <CommunityVoiceCard
              key={voice.id}
              voice={voice}
              isPlaying={playingId === voice.id}
              onPreviewToggle={() => playPreview(voice.id, voice.preview_url)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
