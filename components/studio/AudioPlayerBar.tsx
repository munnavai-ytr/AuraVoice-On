'use client';

import * as React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Download,
  Bookmark,
  MoreVertical,
  Activity,
  Check,
  Copy,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useWavesurfer } from '@/hooks/useWavesurfer';
import { downloadAudioWithId3 } from '@/lib/elevenlabs';
import { cn } from '@/lib/utils';

interface AudioPlayerBarProps {
  audioUrl: string | null;
  audioBlob: Blob | null;
  title: string;
  durationSeconds: number;
  onClose?: () => void;
}

export function AudioPlayerBar({
  audioUrl,
  audioBlob,
  title,
  durationSeconds,
  onClose,
}: AudioPlayerBarProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showMoreMenu, setShowMoreMenu] = React.useState(false);
  const [savedToast, setSavedToast] = React.useState(false);
  const [copiedToast, setCopiedToast] = React.useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = React.useState(false);
  const [trackTitle, setTrackTitle] = React.useState(title || 'Generated Audio');
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);

  const {
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    skip,
  } = useWavesurfer({
    containerRef,
    audioUrl,
  });

  const effectiveDuration = duration > 0 ? duration : durationSeconds;

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleDownload = async () => {
    if (!audioBlob) return;
    await downloadAudioWithId3({
      audioBlob,
      title: trackTitle,
      filename: `vocalis-${Date.now()}.mp3`,
    });
  };

  const handleCopyLink = () => {
    if (audioUrl) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setShowMoreMenu(false);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  if (!audioUrl) return null;

  return (
    <div
      className={cn(
        'fixed bottom-[54px] md:bottom-0 left-0 right-0 z-40 bg-[#0D1117] border-t border-[#2D3F56] shadow-[0_-4px_24px_rgba(0,0,0,0.5)] transition-all duration-300 md:pl-[240px]',
        isMobileExpanded ? 'h-[200px]' : 'h-[72px] md:h-[72px]'
      )}
    >
      {/* Mobile Expand Toggle Handle */}
      <div className="md:hidden flex items-center justify-center pt-1 pb-0.5">
        <button
          type="button"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="w-12 h-3.5 flex items-center justify-center text-[#8899B4]"
        >
          {isMobileExpanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <div className="h-full px-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-6">
        {/* Track Info (Left, ~180px) */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-[180px] shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-[#6366F1]">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            {isEditingTitle ? (
              <input
                type="text"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="bg-[#111827] text-xs font-semibold text-[#F0F4FF] px-1.5 py-0.5 rounded border border-[#6366F1] outline-none"
              />
            ) : (
              <span
                onClick={() => setIsEditingTitle(true)}
                title="Click to rename"
                className="text-xs font-semibold text-[#F0F4FF] truncate cursor-pointer hover:underline"
              >
                {trackTitle}
              </span>
            )}
            <span className="font-mono text-[10px] sm:text-[11px] text-[#8899B4]">
              {formatTime(currentTime)} / {formatTime(effectiveDuration)}
            </span>
          </div>
        </div>

        {/* Waveform Player (Center, flex-1) */}
        <div className="w-full flex-1 flex items-center min-w-0 px-1 sm:px-2">
          <div ref={containerRef} className="w-full h-[32px] sm:h-[40px] cursor-pointer" />
        </div>

        {/* Playback Controls & Action Buttons (Right) */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 w-full md:w-auto shrink-0 pb-1.5 md:pb-0">
          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => skip(-5)}
              title="Skip back 5s"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center justify-center shadow-md shadow-indigo-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skip(5)}
              title="Skip forward 5s"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-[#1E293B] hidden md:block" />

          {/* Action Buttons */}
          <div className="flex items-center gap-1 relative">
            <button
              type="button"
              onClick={handleDownload}
              title="Download MP3 with ID3 metadata"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSave}
              title="Save to Library"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-colors cursor-pointer"
            >
              {savedToast ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-36 rounded-xl bg-[#111827] border border-[#2D3F56] shadow-xl p-1 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTitle(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] rounded-md flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Rename</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235] rounded-md flex items-center gap-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </button>
                  {onClose && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onClose();
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#EF4444] hover:bg-red-500/10 rounded-md flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Close Player</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Temporary Toast notifications */}
      {copiedToast && (
        <div className="absolute top-2 right-6 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-semibold shadow-lg animate-in fade-in">
          Link copied!
        </div>
      )}
      {savedToast && (
        <div className="absolute top-2 right-6 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold shadow-lg animate-in fade-in">
          Saved to Library!
        </div>
      )}
    </div>
  );
}
