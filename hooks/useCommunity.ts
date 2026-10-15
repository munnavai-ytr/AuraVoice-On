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
    id: 'sys-rachel',
    user_id: 'system',
    voice_name: 'Rachel — Natural Conversational',
    elevenlabs_voice_id: '21m00Tcm4TlvDq8ikWAM',
    is_public: true,
    category: 'YouTube',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8312-aab3b3d8f50d.mp3',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    creator_name: 'ElevenLabs Featured',
  },
  {
    id: 'sys-adam',
    user_id: 'system',
    voice_name: 'Adam — Deep Narrator',
    elevenlabs_voice_id: 'pNInz6obpgDQGcFmaJgB',
    is_public: true,
    category: 'Story',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/e0d09593-539d-4a2a-b3d8-a621a7742efd.mp3',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    creator_name: 'ElevenLabs Featured',
  },
  {
    id: 'sys-domi',
    user_id: 'system',
    voice_name: 'Domi — Strong & Confident',
    elevenlabs_voice_id: 'AZnzlk1XvdvUeBnXmlld',
    is_public: true,
    category: 'Ads',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/69c5678b-2573-41c9-b0f8-42c5cee32281.mp3',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    creator_name: 'ElevenLabs Featured',
  },
  {
    id: 'sys-bella',
    user_id: 'system',
    voice_name: 'Bella — Warm Storyteller',
    elevenlabs_voice_id: 'EXAVITQu4vr4xnSDxMaL',
    is_public: true,
    category: 'TikTok',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/ba091482-5714-48c0-bb98-4c1aeee48cec.mp3',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    creator_name: 'ElevenLabs Featured',
  },
  {
    id: 'sys-josh',
    user_id: 'system',
    voice_name: 'Josh — Casual & Friendly',
    elevenlabs_voice_id: 'TxGEqnHWrfWFTfGW9XjX',
    is_public: true,
    category: 'Education',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/eb6f1638-4f44-43e6-8d5c-f6e9e4e0c48b.mp3',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    creator_name: 'ElevenLabs Featured',
  },
  {
    id: 'sys-arnold',
    user_id: 'system',
    voice_name: 'Arnold — Confident Presenter',
    elevenlabs_voice_id: 'VR6AewLTigWG4xSOukaG',
    is_public: true,
    category: 'YouTube',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/d1dcc553-fdf4-4a27-ab88-a1f4d6abb44d.mp3',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    creator_name: 'ElevenLabs Featured',
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
