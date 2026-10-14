'use client';

import * as React from 'react';
import { Play, Pause, Download, MoreHorizontal } from 'lucide-react';
import { AudioCardMenu } from './AudioCardMenu';
import { downloadAudioWithId3 } from '@/lib/elevenlabs';
import { cn } from '@/lib/utils';
import type { GeneratedAudio } from '@/types';

// Pre-calculated heights for 20 static thumbnail bars
const THUMBNAIL_BARS = [
  16, 28, 42, 22, 36,
  50, 24, 38, 46, 20,
  34, 48, 26, 40, 52,
  18, 32, 44, 22, 30,
];

interface AudioCardProps {
  audio: GeneratedAudio;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onDelete: (audio: GeneratedAudio) => Promise<void>;
  onRename: (id: string, newTitle: string) => Promise<void>;
}

export function AudioCard({
  audio,
  isPlaying,
  onPlayToggle,
  onDelete,
  onRename,
}: AudioCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState(audio.title);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Sync title when audio prop changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTitleInput(audio.title);
    }, 0);
    return () => clearTimeout(timer);
  }, [audio.title]);

  // Relative time calculated safely inside effect
  const [relativeTime, setRelativeTime] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const diffMs = Date.now() - new Date(audio.created_at).getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) setRelativeTime('just now');
        else if (diffMins < 60) setRelativeTime(`${diffMins} min ago`);
        else if (diffHours < 24) setRelativeTime(`${diffHours} hour${diffHours > 1 ? 's' : ''} ago`);
        else if (diffDays < 30) setRelativeTime(`${diffDays} day${diffDays > 1 ? 's' : ''} ago`);
        else setRelativeTime(new Date(audio.created_at).toLocaleDateString());
      } catch {
        setRelativeTime('');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [audio.created_at]);

  const handleTitleSubmit = async () => {
    setIsEditing(false);
    if (titleInput.trim() && titleInput.trim() !== audio.title) {
      await onRename(audio.id, titleInput.trim());
    } else {
      setTitleInput(audio.title);
    }
  };

  const handleDownload = async () => {
    if (!audio.audio_url) return;
    try {
      const res = await fetch(audio.audio_url);
      const blob = await res.blob();
      await downloadAudioWithId3({
        audioBlob: blob,
        title: audio.title,
        filename: `${audio.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp3`,
      });
    } catch {
      const a = document.createElement('a');
      a.href = audio.audio_url;
      a.download = `${audio.title}.mp3`;
      a.target = '_blank';
      a.click();
    }
  };

  // Format MM:SS duration
  const formatDuration = (secs: number | null) => {
    const s = secs || 0;
    const m = Math.floor(s / 60);
    const remainder = Math.floor(s % 60);
    return `${m}:${remainder.toString().padStart(2, '0')}`;
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

  const rawCat = (audio.category || 'youtube').toLowerCase();
  const badgeStyle = categoryStyles[rawCat] || 'bg-indigo-500/15 text-[#818CF8]';

  return (
    <div className="relative rounded-[14px] bg-[#0D1117] border border-[#1E293B] overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-[#2D3F56] flex flex-col group select-none text-left">
      {/* Top Waveform Thumbnail */}
      <div className="relative h-[72px] bg-gradient-to-br from-[#111827] to-[#1A2235] px-4 flex items-end justify-between pb-3">
        {/* 20 Static Mini Waveform Bars */}
        <div className="flex items-end gap-1 w-full max-w-[200px] h-[52px]">
          {THUMBNAIL_BARS.map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-[rgba(99,102,241,0.4)] transition-opacity group-hover:opacity-80"
              style={{ height: `${height}px` }}
            />
          ))}
        </div>

        {/* Category Pill Badge */}
        <div
          className={cn(
            'absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase',
            badgeStyle
          )}
        >
          {audio.category || 'YouTube'}
        </div>
      </div>

      {/* Body Section */}
      <div className="p-3.5 flex flex-col gap-2">
        {/* Title (Inline editable) */}
        {isEditing ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setTitleInput(audio.title);
                setIsEditing(false);
              }
            }}
            autoFocus
            className="w-full bg-transparent border-b border-[#6366F1] text-sm font-semibold text-[#F0F4FF] outline-none py-0.5 font-inter"
          />
        ) : (
          <h4
            onClick={() => setIsEditing(true)}
            title="Click to rename"
            className="font-inter font-semibold text-sm text-[#F0F4FF] truncate cursor-pointer hover:text-[#818CF8] transition-colors leading-snug"
          >
            {audio.title}
          </h4>
        )}

        {/* Meta Row: Duration · Relative Date */}
        <div className="flex items-center gap-1.5 text-xs text-[#4B6080]">
          <span className="font-mono">{formatDuration(audio.duration_seconds)}</span>
          <span>·</span>
          <span>{relativeTime || 'recently'}</span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/70 mt-1">
          <div className="flex items-center gap-2">
            {/* Play Button */}
            <button
              type="button"
              onClick={onPlayToggle}
              className="h-[32px] px-3 rounded-[8px] bg-[#111827] hover:bg-[#1A2235] border border-[#2D3F56] text-[#8899B4] hover:text-[#F0F4FF] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>Playing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#6366F1] fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              title="Download MP3"
              className="h-[32px] px-2.5 rounded-[8px] bg-[#111827] hover:bg-[#1A2235] border border-[#2D3F56] text-[#8899B4] hover:text-[#F0F4FF] text-xs transition-colors cursor-pointer flex items-center justify-center"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* More Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            <AudioCardMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onRename={() => setIsEditing(true)}
              audioUrl={audio.audio_url}
              onDelete={() => onDelete(audio)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
