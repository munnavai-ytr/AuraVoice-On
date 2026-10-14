'use client';

import * as React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useLibrary } from '@/hooks/useLibrary';
import { FilterBar } from '@/components/library/FilterBar';
import { AudioCard } from '@/components/library/AudioCard';
import { EmptyLibrary } from '@/components/library/EmptyLibrary';

export default function LibraryPage() {
  const {
    audios,
    totalCount,
    isLoading,
    filter,
    setFilter,
    sort,
    setSort,
    playingId,
    playAudio,
    deleteAudio,
    renameAudio,
  } = useLibrary();

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-[#F0F4FF]">
            My Library
          </h2>
          <p className="text-xs sm:text-sm text-[#8899B4] mt-0.5">
            {totalCount} {totalCount === 1 ? 'audio' : 'audios'} generated
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
              className="h-[36px] pl-8 pr-4 rounded-[10px] bg-[#111827] border border-[#1E293B] text-xs font-medium text-[#8899B4] hover:text-[#F0F4FF] outline-none cursor-pointer appearance-none transition-colors"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#4B6080] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar activeFilter={filter} onFilterChange={setFilter} />

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[180px] rounded-[14px] bg-[#0D1117] border border-[#1E293B] animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="h-12 w-full bg-[#111827] rounded-lg" />
              <div className="h-4 w-3/4 bg-[#111827] rounded" />
              <div className="h-8 w-1/2 bg-[#111827] rounded" />
            </div>
          ))}
        </div>
      ) : audios.length === 0 ? (
        <EmptyLibrary />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
          {audios.map((audio) => (
            <AudioCard
              key={audio.id}
              audio={audio}
              isPlaying={playingId === audio.id}
              onPlayToggle={() => playAudio(audio.id, audio.audio_url)}
              onDelete={deleteAudio}
              onRename={renameAudio}
            />
          ))}
        </div>
      )}
    </div>
  );
}
