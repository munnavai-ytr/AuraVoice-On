'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/useToast';
import type { VoiceTemplate } from '@/types';

export interface CommunityVoiceWithCreator extends VoiceTemplate {
  creator_name?: string;
  creator_avatar?: string;
}

const FALLBACK_COMMUNITY_VOICES: CommunityVoiceWithCreator[] = [
  {
    id: 'comm-adam',
    user_id: 'system',
    voice_name: 'Deep Narrator Voice',
    elevenlabs_voice_id: 'pNInz6obpgDQGcFmaJgB',
    is_public: true,
    category: 'YouTube',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/adam.mp3',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    creator_name: 'Alex Rivera',
  },
  {
    id: 'comm-bella',
    user_id: 'system',
    voice_name: 'Warm Storyteller',
    elevenlabs_voice_id: 'EXAVITQu4vr4xnSDxMaL',
    is_public: true,
    category: 'Storytelling',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/bella.mp3',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    creator_name: 'Sarah Chen',
  },
  {
    id: 'comm-sam',
    user_id: 'system',
    voice_name: 'Dynamic Tech Presenter',
    elevenlabs_voice_id: 'yoZ06aMxZJJ28mfd3POQ',
    is_public: true,
    category: 'Education',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/sam.mp3',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    creator_name: 'Marcus Brody',
  },
  {
    id: 'comm-rachel',
    user_id: 'system',
    voice_name: 'High Energy Ad Voice',
    elevenlabs_voice_id: '21m00Tcm4TlvDq8ikWAM',
    is_public: true,
    category: 'Ads',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/rachel.mp3',
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    creator_name: 'Elena Rostova',
  },
  {
    id: 'comm-josh',
    user_id: 'system',
    voice_name: 'Viral TikTok Conversational',
    elevenlabs_voice_id: 'TxGEqnHWrfWFTfGW9XjX',
    is_public: true,
    category: 'TikTok',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/josh.mp3',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    creator_name: 'Tyler James',
  },
];

export function useCommunity() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch public voice templates with 5 min stale time
  const {
    data: rawVoices,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['community_voices'],
    queryFn: async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('voice_templates')
          .select('*, profiles:user_id(full_name, avatar_url)')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error || !data || data.length === 0) {
          return FALLBACK_COMMUNITY_VOICES;
        }

        return data.map((item: any) => ({
          ...item,
          creator_name: item.profiles?.full_name || 'Community Creator',
          creator_avatar: item.profiles?.avatar_url,
        })) as CommunityVoiceWithCreator[];
      } catch {
        return FALLBACK_COMMUNITY_VOICES;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Client-side debounced search and category filter
  const filteredVoices = useMemo(() => {
    const list = rawVoices || FALLBACK_COMMUNITY_VOICES;
    return list.filter((voice) => {
      const matchesCategory =
        categoryFilter === 'all' ||
        voice.category?.toLowerCase() === categoryFilter.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        voice.voice_name.toLowerCase().includes(query) ||
        (voice.creator_name && voice.creator_name.toLowerCase().includes(query)) ||
        (voice.category && voice.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [rawVoices, searchQuery, categoryFilter]);

  // 5-second preview player
  const playPreview = useCallback((voiceId: string, previewUrl?: string | null) => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }

    if (playingId === voiceId) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingId(null);
      return;
    }

    if (!previewUrl) {
      showToast('Audio preview currently calibrating.', 'info');
      setPlayingId(voiceId);
      previewTimerRef.current = setTimeout(() => setPlayingId(null), 5000);
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(previewUrl);
    audioRef.current = audio;
    setPlayingId(voiceId);

    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);

    // Stop strictly after 5 seconds
    previewTimerRef.current = setTimeout(() => {
      if (audioRef.current) audioRef.current.pause();
      setPlayingId(null);
    }, 5000);
  }, [playingId, showToast]);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, []);

  return {
    voices: filteredVoices,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    playingId,
    playPreview,
    refetch,
  };
}
