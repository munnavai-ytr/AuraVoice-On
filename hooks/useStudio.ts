'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';
import { saveAudioToSupabase } from '@/lib/elevenlabs';

export function useStudio() {
  const { user, profile } = useAppStore();

  // ── SCRIPT STATE ──
  const [script, setScript] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // ── VOICE STATE (derived with override) ──
  const [voiceOverride, setVoiceOverride] = useState<{ id: string; name: string } | null>(null);
  const [voiceTab, setVoiceTab] = useState<'mine' | 'community'>('mine');

  const selectedVoiceId =
    voiceOverride?.id ?? profile?.user_voice_id ?? '';

  const selectedVoiceName =
    voiceOverride?.name ?? (profile?.full_name ? `${profile.full_name}'s Voice` : 'My Voice');

  // ── SETTINGS STATE (Lazy initialized from localStorage) ──
  const [stability, setStabilityState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vocalis_stability');
        if (saved !== null) return parseFloat(saved);
      } catch {}
    }
    return 0.35;
  });

  const [similarity, setSimilarityState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vocalis_similarity');
        if (saved !== null) return parseFloat(saved);
      } catch {}
    }
    return 0.75;
  });

  const [style, setStyleState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vocalis_style');
        if (saved !== null) return parseFloat(saved);
      } catch {}
    }
    return 0.0;
  });

  const [modelId, setModelIdState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vocalis_model_id');
        if (saved) return saved;
      } catch {}
    }
    return 'eleven_turbo_v2_5';
  });

  // ── CATEGORY STATE ──
  const [category, setCategory] = useState('youtube');

  // ── GENERATION STATE ──
  const [genStatus, setGenStatus] = useState<
    'idle' | 'generating' | 'success' | 'error'
  >('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [genError, setGenError] = useState<string | null>(null);

  // Update setters with localStorage sync
  const setStability = useCallback((val: number) => {
    setStabilityState(val);
    try {
      localStorage.setItem('vocalis_stability', String(val));
    } catch {}
  }, []);

  const setSimilarity = useCallback((val: number) => {
    setSimilarityState(val);
    try {
      localStorage.setItem('vocalis_similarity', String(val));
    } catch {}
  }, []);

  const setStyle = useCallback((val: number) => {
    setStyleState(val);
    try {
      localStorage.setItem('vocalis_style', String(val));
    } catch {}
  }, []);

  const setModelId = useCallback((val: string) => {
    setModelIdState(val);
    try {
      localStorage.setItem('vocalis_model_id', val);
    } catch {}
  }, []);

  const setSelectedVoice = useCallback((id: string, name: string) => {
    setVoiceOverride({ id, name });
  }, []);

  // Insert emotion tag at cursor position
  const insertTag = useCallback(
    (tag: string, textareaRef: React.RefObject<HTMLTextAreaElement | null>) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = script.slice(start, end);

      const isTagActive = activeTags.includes(tag);

      if (isTagActive) {
        // Deselect tag
        setActiveTags((prev) => prev.filter((t) => t !== tag));
      } else {
        // Select tag & insert SSML tag
        setActiveTags((prev) => [...prev, tag]);

        const wrapped = selected ? `<${tag}>${selected}</${tag}>` : `<${tag}></${tag}>`;
        const newScript = script.slice(0, start) + wrapped + script.slice(end);
        setScript(newScript);

        setTimeout(() => {
          const newPos = selected ? start + wrapped.length : start + tag.length + 2;
          ta.setSelectionRange(newPos, newPos);
          ta.focus();
        }, 0);
      }
    },
    [script, activeTags]
  );

  const clearAllTags = useCallback(() => {
    setActiveTags([]);
  }, []);

  // Generate audio stream via Next.js API
  const generateAudio = useCallback(async () => {
    if (!script.trim() || !selectedVoiceId || genStatus === 'generating') {
      return;
    }

    setGenStatus('generating');
    setGenError(null);

    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId: selectedVoiceId,
          script: script.trim(),
          stability,
          similarity,
          style,
          modelId,
          title: script.trim().slice(0, 50),
          category,
        }),
      });

      if (!res.ok) {
        let errMessage = 'Audio generation failed.';
        try {
          const errData = (await res.json()) as { message?: string; code?: string };
          if (errData.code === 'quota_exceeded') {
            errMessage =
              "You've used all your characters this month. Upgrade your ElevenLabs plan or wait for reset.";
          } else if (errData.code === 'voice_not_found') {
            errMessage = 'Voice not found. Try re-cloning your voice in Voice Studio.';
          } else if (errData.code === 'invalid_api_key') {
            errMessage = 'Invalid API key. Please check your credentials in Settings.';
          } else if (errData.message) {
            errMessage = errData.message;
          }
        } catch {
          errMessage = `Server error (${res.status}): ${res.statusText}`;
        }
        throw new Error(errMessage);
      }

      // Convert audio stream response into audio blob and object URL
      const blob = await res.blob();
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Measure duration via Audio metadata
      const audioElem = new Audio(url);
      const measuredDuration = await new Promise<number>((resolve) => {
        audioElem.addEventListener('loadedmetadata', () => {
          resolve(Math.round(audioElem.duration) || 0);
        });
        audioElem.addEventListener('error', () => {
          // Approximate by word count (15 chars ~ 1s)
          resolve(Math.max(3, Math.round(script.trim().length / 15)));
        });
      });

      setAudioDuration(measuredDuration);

      // Save to Supabase Storage and DB if user is signed in
      if (user?.id) {
        try {
          const supabase = createClient();
          await saveAudioToSupabase({
            supabase,
            userId: user.id,
            audioBlob: blob,
            title: script.trim().slice(0, 50),
            script: script.trim(),
            voiceId: selectedVoiceId,
            category,
            duration: measuredDuration,
          });
        } catch (saveErr) {
          console.warn('Failed to persist audio record in Supabase:', saveErr);
        }
      }

      setGenStatus('success');
      setTimeout(() => setGenStatus('idle'), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setGenError(message);
      setGenStatus('error');
    }
  }, [
    script,
    selectedVoiceId,
    genStatus,
    stability,
    similarity,
    style,
    modelId,
    category,
    user,
  ]);

  const enhanceScript = useCallback(async () => {
    if (!script.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, category, tone: 'engaging' }),
      });
      if (!res.ok) throw new Error('Enhancement failed');
      const data = await res.json() as { enhanced?: string; error?: string };
      if (data.enhanced) {
        setScript(data.enhanced);
      }
    } catch {
      // fail silently, keep original script
    } finally {
      setIsEnhancing(false);
    }
  }, [script, category, isEnhancing]);

  const resetSettings = useCallback(() => {
    setStability(0.35);
    setSimilarity(0.75);
    setStyle(0.0);
  }, [setStability, setSimilarity, setStyle]);

  return {
    script,
    setScript,
    activeTags,
    setActiveTags,
    cursorPosition,
    setCursorPosition,
    insertTag,
    clearAllTags,
    selectedVoiceId,
    selectedVoiceName,
    setSelectedVoice,
    voiceTab,
    setVoiceTab,
    stability,
    setStability,
    similarity,
    setSimilarity,
    style,
    setStyle,
    modelId,
    setModelId,
    category,
    setCategory,
    genStatus,
    audioUrl,
    audioBlob,
    audioDuration,
    genError,
    generateAudio,
    enhanceScript,
    isEnhancing,
    resetSettings,
  };
}
