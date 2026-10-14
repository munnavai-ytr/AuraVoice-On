'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Play, Pause, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import type { CommunityVoiceWithCreator } from '@/hooks/useCommunity';

interface CommunityVoiceCardProps {
  voice: CommunityVoiceWithCreator;
  isPlaying: boolean;
  onPreviewToggle: () => void;
}

export function CommunityVoiceCard({
  voice,
  isPlaying,
  onPreviewToggle,
}: CommunityVoiceCardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const handleUseVoice = () => {
    // Store selected community voice in session or query param and navigate to /studio
    try {
      localStorage.setItem('vocalis_selected_voice_id', voice.elevenlabs_voice_id);
      localStorage.setItem('vocalis_selected_voice_name', voice.voice_name);
    } catch {}

    showToast(`Voice "${voice.voice_name}" selected! Opening Studio...`, 'success');
    router.push('/studio');
  };

  // Category Badge Styles
  const categoryStyles: Record<string, string> = {
    youtube: 'bg-[rgba(255,0,0,0.15)] text-[#FF4444]',
    tiktok: 'bg-[rgba(0,0,0,0.4)] text-[#F0F4FF] border border-[#333]',
    ads: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
    storytelling: 'bg-[rgba(139,92,246,0.15)] text-[#8B5CF6]',
    story: 'bg-[rgba(139,92,246,0.15)] text-[#8B5CF6]',
    education: 'bg-[rgba(6,182,212,0.15)] text-[#06B6D4]',
  };

  const rawCat = (voice.category || 'youtube').toLowerCase();
  const badgeStyle = categoryStyles[rawCat] || 'bg-indigo-500/15 text-[#818CF8]';

  const creatorInitial = voice.creator_name ? voice.creator_name.charAt(0).toUpperCase() : 'V';

  return (
    <div className="relative rounded-[14px] bg-[#0D1117] border border-[#1E293B] p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#2D3F56] flex flex-col justify-between select-none text-left shadow-sm">
      {/* Top Category Badge */}
      <div
        className={cn(
          'absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase',
          badgeStyle
        )}
      >
        {voice.category || 'YouTube'}
      </div>

      {/* Creator Info */}
      <div className="flex items-center gap-3 pr-16 mb-3">
        {voice.creator_avatar ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#2D3F56]">
            <Image
              src={voice.creator_avatar}
              alt={voice.creator_name || 'Creator'}
              width={40}
              height={40}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-indigo-500/20">
            {creatorInitial}
          </div>
        )}

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs text-[#F0F4FF] truncate">
            {voice.creator_name || 'Community Creator'}
          </span>
          <span className="text-[11px] text-[#4B6080] truncate">
            @{voice.creator_name ? voice.creator_name.toLowerCase().replace(/\s+/g, '') : 'vocalis'}
          </span>
        </div>
      </div>

      {/* Voice Title */}
      <h4 className="font-inter font-bold text-base text-[#F0F4FF] mb-3 tracking-tight">
        {voice.voice_name}
      </h4>

      {/* Mini Decorative Waveform (Fixed visual) */}
      <div className="w-full h-8 flex items-end gap-1 mb-4 px-1 bg-[#111827]/40 rounded-lg py-1 border border-[#1E293B]/40">
        {[20, 45, 80, 50, 30, 65, 90, 40, 70, 85, 35, 60, 75, 40, 55].map((h, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-full transition-all',
              isPlaying ? 'bg-[#6366F1] animate-pulse' : 'bg-[#2D3F56]'
            )}
            style={{
              height: `${Math.max(6, Math.round((h / 100) * 24))}px`,
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1E293B]/60">
        {/* Preview Button with tiny animated bars */}
        <button
          type="button"
          onClick={onPreviewToggle}
          className="h-[34px] px-3 rounded-[8px] bg-[#111827] hover:bg-[#1A2235] border border-[#2D3F56] text-[#8899B4] hover:text-[#F0F4FF] text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-[#6366F1]" />
              {/* 3 tiny animated bars */}
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-[#6366F1] animate-[pulse_0.6s_infinite]" />
                <span className="w-0.5 h-2/3 bg-[#6366F1] animate-[pulse_0.8s_infinite_0.2s]" />
                <span className="w-0.5 h-4/5 bg-[#6366F1] animate-[pulse_0.7s_infinite_0.4s]" />
              </div>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[#6366F1] fill-current" />
              <span>Preview</span>
            </>
          )}
        </button>

        {/* Use Voice Button */}
        <button
          type="button"
          onClick={handleUseVoice}
          className="h-[34px] px-3.5 rounded-[8px] bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-500/25 transition-all cursor-pointer active:scale-95"
        >
          <span>Use Voice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
