'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/useToast';
import type { GeneratedAudio } from '@/types';

export function useLibrary() {
  const { user } = useAppStore();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch all generated audios using React Query
  const {
    data: audios,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['library', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from('generated_audios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return (data || []) as GeneratedAudio[];
    },
    enabled: Boolean(user?.id),
    staleTime: 30_000,
  });

  // Filter & Sort
  const filteredAudios = useMemo(() => {
    if (!audios) return [];
    let result = audios;

    if (filter !== 'all') {
      result = result.filter(
        (a) => a.category?.toLowerCase() === filter.toLowerCase()
      );
    }

    if (sort === 'oldest') {
      return [...result].reverse();
    }
    return result;
  }, [audios, filter, sort]);

  // Audio Playback
  const playAudio = useCallback((audioId: string, audioUrl?: string | null) => {
    if (playingId === audioId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
      return;
    }

    if (!audioUrl) {
      showToast('Audio file is being processed or unavailable.', 'warning');
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingId(audioId);

    audio
      .play()
      .then(() => {
        audio.onended = () => setPlayingId(null);
      })
      .catch((err) => {
        console.warn('Playback blocked or failed:', err);
        setPlayingId(null);
      });
  }, [playingId, showToast]);

  // Delete audio
  const deleteAudio = useCallback(
    async (audio: GeneratedAudio) => {
      const supabase = createClient();

      try {
        // Extract storage path if exists
        if (audio.audio_url && audio.audio_url.includes('generated-audios')) {
          const path = audio.audio_url.split('/generated-audios/')[1];
          if (path) {
            await supabase.storage.from('generated-audios').remove([path]);
          }
        }

        // Delete row from DB
        const { error } = await supabase
          .from('generated_audios')
          .delete()
          .eq('id', audio.id);

        if (error) throw error;

        showToast('Audio deleted successfully.', 'info');
        refetch();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete audio.';
        showToast(msg, 'error');
      }
    },
    [refetch, showToast]
  );

  // Rename audio
  const renameAudio = useCallback(
    async (id: string, newTitle: string) => {
      if (!newTitle.trim()) return;
      const supabase = createClient();

      try {
        const { error } = await supabase
          .from('generated_audios')
          .update({ title: newTitle.trim() })
          .eq('id', id);

        if (error) throw error;

        showToast('Renamed ✓', 'success');
        refetch();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update title.';
        showToast(msg, 'error');
      }
    },
    [refetch, showToast]
  );

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    audios: filteredAudios,
    totalCount: audios?.length || 0,
    isLoading,
    filter,
    setFilter,
    sort,
    setSort,
    playingId,
    playAudio,
    deleteAudio,
    renameAudio,
    refetch,
  };
}
