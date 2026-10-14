'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Mic,
  Play,
  Pause,
  Check,
  Lock,
  ArrowRight,
  User,
  Radio,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { VoiceTemplate } from '@/types';

// Curated community fallback voices in case database has no public templates
const CURATED_COMMUNITY_VOICES: Partial<VoiceTemplate>[] = [
  {
    id: 'comm-1',
    voice_name: 'Deep Narrator',
    elevenlabs_voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam
    is_public: true,
    category: 'YouTube',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/adam.mp3',
  },
  {
    id: 'comm-2',
    voice_name: 'Warm Storyteller',
    elevenlabs_voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella
    is_public: true,
    category: 'Story',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/bella.mp3',
  },
  {
    id: 'comm-3',
    voice_name: 'Modern Tech Lead',
    elevenlabs_voice_id: 'yoZ06aMxZJJ28mfd3POQ', // Sam
    is_public: true,
    category: 'Education',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/sam.mp3',
  },
];

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string, voiceName: string) => void;
  voiceTab: 'mine' | 'community';
  onTabChange: (tab: 'mine' | 'community') => void;
}

export function VoiceSelector({
  selectedVoiceId,
  onSelectVoice,
  voiceTab,
  onTabChange,
}: VoiceSelectorProps) {
  const { profile } = useAppStore();
  const [communityVoices, setCommunityVoices] = React.useState<VoiceTemplate[]>([]);
  const [playingPreviewId, setPlayingPreviewId] = React.useState<string | null>(null);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const hasMyVoice = Boolean(profile?.user_voice_id);
  const myVoiceName = profile?.full_name ? `${profile.full_name}'s Voice` : 'My Voice';

  // Fetch public community templates
  React.useEffect(() => {
    let isMounted = true;
    async function fetchCommunity() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('voice_templates')
          .select('*')
          .eq('is_public', true)
          .limit(10);

        if (!error && data && data.length > 0 && isMounted) {
          setCommunityVoices(data as VoiceTemplate[]);
        } else if (isMounted) {
          setCommunityVoices(CURATED_COMMUNITY_VOICES as VoiceTemplate[]);
        }
      } catch {
        if (isMounted) {
          setCommunityVoices(CURATED_COMMUNITY_VOICES as VoiceTemplate[]);
        }
      }
    }

    fetchCommunity();

    return () => {
      isMounted = false;
    };
  }, []);

  // 5-second sample audio preview player
  const handleTogglePreview = (id: string, url?: string | null) => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }

    if (playingPreviewId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingPreviewId(null);
      return;
    }

    if (!url) {
      // Simulate 5-second playback if preview url not supplied
      setPlayingPreviewId(id);
      previewTimerRef.current = setTimeout(() => {
        setPlayingPreviewId(null);
      }, 5000);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingPreviewId(id);

    audio.play().catch(() => {
      setPlayingPreviewId(null);
    });

    audio.onended = () => {
      setPlayingPreviewId(null);
    };

    // Auto-stop preview after 5s limit
    previewTimerRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingPreviewId(null);
    }, 5000);
  };

  // Cleanup audio preview on unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* Tab Switcher */}
      <div className="w-full flex border-b border-[#1E293B]">
        <button
          type="button"
          onClick={() => onTabChange('mine')}
          className={cn(
            'flex-1 pb-2 sm:pb-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center border-b-2',
            voiceTab === 'mine'
              ? 'border-[#6366F1] text-[#F0F4FF]'
              : 'border-transparent text-[#8899B4] hover:text-[#F0F4FF]'
          )}
        >
          My Voice
        </button>
        <button
          type="button"
          onClick={() => onTabChange('community')}
          className={cn(
            'flex-1 pb-2 sm:pb-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center border-b-2',
            voiceTab === 'community'
              ? 'border-[#6366F1] text-[#F0F4FF]'
              : 'border-transparent text-[#8899B4] hover:text-[#F0F4FF]'
          )}
        >
          Community Voices
        </button>
      </div>

      {/* Tab 1: My Voice */}
      {voiceTab === 'mine' && (
        <div className="w-full">
          {hasMyVoice ? (
            <div
              onClick={() => onSelectVoice(profile!.user_voice_id!, myVoiceName)}
              className={cn(
                'w-full p-3 sm:p-4 rounded-[10px] sm:rounded-[12px] transition-all cursor-pointer flex items-center justify-between',
                selectedVoiceId === profile?.user_voice_id
                  ? 'bg-[rgba(99,102,241,0.08)] border-[1.5px] border-[#6366F1] shadow-md shadow-indigo-500/10'
                  : 'bg-[#111827] border border-[#1E293B] hover:border-[#2D3F56]'
              )}
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#F0F4FF] tracking-tight">
                      {myVoiceName}
                    </h4>
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6366F1] flex items-center justify-center">
                      <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white stroke-[3]" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#8899B4] mt-0.5">
                    <Lock className="w-3 h-3 text-[#4B6080]" />
                    <span>Private Model</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePreview('my-voice', null);
                }}
                className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-[#1A2235] hover:bg-[#2D3F56] border border-[#2D3F56] text-[#8899B4] hover:text-[#F0F4FF] text-[11px] sm:text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {playingPreviewId === 'my-voice' ? (
                  <>
                    <Pause className="w-3 h-3 text-[#6366F1]" />
                    <span>5s...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current text-[#6366F1]" />
                    <span>Preview</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="w-full p-6 rounded-[12px] border-2 border-dashed border-[#2D3F56] text-center flex flex-col items-center justify-center bg-[#111827]/40">
              <div className="w-10 h-10 rounded-xl bg-[#1A2235] flex items-center justify-center mb-3 text-[#8899B4]">
                <Radio className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-[#F0F4FF] mb-1">
                No voice cloned yet
              </p>
              <p className="text-xs text-[#8899B4] max-w-[240px] mb-4">
                Record a quick 60-second sample to clone your personal AI voice model.
              </p>
              <Link
                href="/voice-studio"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Clone Your Voice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Community Voices */}
      {voiceTab === 'community' && (
        <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
          {communityVoices.map((voice) => {
            const isSelected = selectedVoiceId === voice.elevenlabs_voice_id;

            return (
              <div
                key={voice.id}
                onClick={() =>
                  onSelectVoice(voice.elevenlabs_voice_id, voice.voice_name)
                }
                className={cn(
                  'w-full p-2.5 sm:p-3.5 rounded-[10px] sm:rounded-[12px] transition-all cursor-pointer flex items-center justify-between',
                  isSelected
                    ? 'bg-[rgba(99,102,241,0.08)] border-[1.5px] border-[#6366F1] shadow-sm'
                    : 'bg-[#111827] border border-[#1E293B] hover:border-[#2D3F56]'
                )}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1A2235] border border-[#2D3F56] flex items-center justify-center text-[#8899B4] shrink-0">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <h5 className="text-xs sm:text-sm font-semibold text-[#F0F4FF] truncate">
                      {voice.voice_name}
                    </h5>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-[#1A2235] text-[#8899B4] border border-[#2D3F56]/60">
                        {voice.category || 'Creator'}
                      </span>
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-[#818CF8]">
                        English
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePreview(voice.id, voice.preview_url);
                    }}
                    className="h-7 sm:h-8 px-1.5 sm:px-2 rounded-lg bg-[#1A2235] hover:bg-[#2D3F56] border border-[#2D3F56] text-[#8899B4] text-[11px] sm:text-xs flex items-center gap-1"
                  >
                    {playingPreviewId === voice.id ? (
                      <Pause className="w-3 h-3 text-[#6366F1]" />
                    ) : (
                      <Play className="w-3 h-3 fill-current text-[#6366F1]" />
                    )}
                    <span className="text-[10px] sm:text-[11px]">5s</span>
                  </button>

                  <button
                    type="button"
                    className={cn(
                      'h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors',
                      isSelected
                        ? 'bg-[#6366F1] text-white font-semibold'
                        : 'bg-transparent text-[#8899B4] hover:text-[#F0F4FF]'
                    )}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
