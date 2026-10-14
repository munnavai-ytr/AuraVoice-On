'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type WaveSurfer from 'wavesurfer.js';

interface UseWavesurferOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  audioUrl: string | null;
}

export function useWavesurfer({ containerRef, audioUrl }: UseWavesurferOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) {
      return;
    }

    let isCancelled = false;
    let wsInstance: WaveSurfer | null = null;

    async function initWavesurfer() {
      try {
        const WaveSurferModule = (await import('wavesurfer.js')).default;

        if (isCancelled || !containerRef.current) return;

        // Destroy any existing instance before mounting a new one
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }

        wsInstance = WaveSurferModule.create({
          container: containerRef.current,
          waveColor: '#6366F1',
          progressColor: '#818CF8',
          cursorColor: '#F0F4FF',
          cursorWidth: 2,
          height: 40,
          barWidth: 2,
          barGap: 2,
          barRadius: 2,
          url: audioUrl || undefined,
          normalize: true,
        });

        wavesurferRef.current = wsInstance;

        wsInstance.on('ready', (d) => {
          if (!isCancelled) {
            setDuration(d);
            setIsReady(true);
          }
        });

        wsInstance.on('play', () => {
          if (!isCancelled) setIsPlaying(true);
        });

        wsInstance.on('pause', () => {
          if (!isCancelled) setIsPlaying(false);
        });

        wsInstance.on('finish', () => {
          if (!isCancelled) {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        });

        wsInstance.on('timeupdate', (time) => {
          if (!isCancelled) setCurrentTime(time);
        });
      } catch (err) {
        console.error('WaveSurfer initialization failed:', err);
      }
    }

    initWavesurfer();

    return () => {
      isCancelled = true;
      if (wsInstance) {
        wsInstance.destroy();
      }
      wavesurferRef.current = null;
      setIsPlaying(false);
      setIsReady(false);
    };
  }, [containerRef, audioUrl]);

  const togglePlayPause = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);

  const play = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.pause();
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    if (wavesurferRef.current) {
      const current = wavesurferRef.current.getCurrentTime();
      const target = Math.max(0, Math.min(current + seconds, wavesurferRef.current.getDuration()));
      wavesurferRef.current.setTime(target);
    }
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    isPlaying,
    currentTime,
    duration,
    progress,
    isReady,
    togglePlayPause,
    play,
    pause,
    skip,
  };
}
