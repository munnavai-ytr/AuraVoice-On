'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/useToast';
import { getUserInfo, detectKeyAccess, deleteVoice } from '@/lib/elevenlabs';
import type { ELKeyInfo, Profile } from '@/types';

export const ACCENT_COLORS = [
  { name: 'Indigo', hex: '#6366F1', darkHex: '#4F46E5' },
  { name: 'Violet', hex: '#8B5CF6', darkHex: '#7C3AED' },
  { name: 'Cyan', hex: '#06B6D4', darkHex: '#0891B2' },
  { name: 'Rose', hex: '#F43F5E', darkHex: '#E11D48' },
  { name: 'Amber', hex: '#F59E0B', darkHex: '#D97706' },
];

export function useSettings() {
  const { user, profile, setProfile, setTheme: setStoreTheme } = useAppStore();
  const { showToast } = useToast();

  // Profile Form State
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [displayName, setDisplayName] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('vocalis_display_name') || '';
      } catch {
        return '';
      }
    }
    return '';
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync profile details when profile loads
  useEffect(() => {
    if (profile?.full_name) {
      const timer = setTimeout(() => {
        setFullName(profile.full_name || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile?.full_name]);

  // API Key Form State - initialize from profile, user metadata or local storage
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    if (profile?.custom_api_key) return profile.custom_api_key;
    if (user?.user_metadata?.custom_api_key) return user.user_metadata.custom_api_key as string;
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('vocalis_custom_api_key') || '';
      } catch {
        return '';
      }
    }
    return '';
  });
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<ELKeyInfo | null>(null);
  const [isSavingKey, setIsSavingKey] = useState(false);

  // Sync apiKeyInput on mount if user metadata has it and input is empty
  useEffect(() => {
    const metaKey = (user?.user_metadata?.custom_api_key as string) || '';
    if (metaKey && !apiKeyInput) {
      const timer = setTimeout(() => {
        setApiKeyInput(metaKey);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user?.user_metadata, apiKeyInput]);

  // Voice Model State
  const [isSharingVoice, setIsSharingVoice] = useState(false);
  const [isDeletingVoice, setIsDeletingVoice] = useState(false);

  // Appearance State with lazy initializers from localStorage
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('vocalis_theme_mode') as 'dark' | 'light' | 'system';
        if (savedTheme) return savedTheme;
      } catch {}
    }
    return 'dark';
  });
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('vocalis_lang');
        if (savedLang) return savedLang;
      } catch {}
    }
    return 'en';
  });
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedAccent = localStorage.getItem('vocalis_accent');
        if (savedAccent) return savedAccent;
      } catch {}
    }
    return '#6366F1';
  });

  // Apply saved theme mode & accent color to CSS root on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('vocalis_theme_mode');
      if (savedMode === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        document.documentElement.style.setProperty('--bg-page', '#F1F5F9');
        document.documentElement.style.setProperty('--bg-card', '#FFFFFF');
        document.documentElement.style.setProperty('--text-primary', '#0F172A');
        document.documentElement.style.setProperty('--text-muted', '#64748B');
        document.documentElement.style.setProperty('--border', '#E2E8F0');
      } else if (savedMode === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!isDark) {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      }

      const savedAccent = localStorage.getItem('vocalis_accent');
      if (savedAccent) {
        document.documentElement.style.setProperty('--indigo', savedAccent);
      }
    } catch {}
  }, []);

  // Compress image to 256x256 via canvas before uploading
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Center crop to square
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, 256, 256);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Image compression failed'));
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = reject;
    });
  };

  // Avatar upload
  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user?.id) return;
      setIsUploadingAvatar(true);

      try {
        const compressedBlob = await compressImage(file);
        const supabase = createClient();
        const fileName = `${user.id}-${Date.now()}.jpg`;
        let publicUrl = '';

        // Try Supabase Storage first
        try {
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, compressedBlob, {
              contentType: 'image/jpeg',
              upsert: true,
            });

          if (!uploadError) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
            publicUrl = data.publicUrl;
          }
        } catch {
          // Storage bucket might not exist
        }

        // Fallback: use object URL for immediate preview
        if (!publicUrl) {
          publicUrl = URL.createObjectURL(compressedBlob);
        }

        // Always update profile in DB with whatever URL we got
        const { error: dbError } = await supabase
          .from('profiles')
          .upsert(
            { id: user.id, avatar_url: publicUrl },
            { onConflict: 'id' }
          );

        if (dbError) {
          console.warn('Profile avatar update notice:', dbError.message);
        }

        // Always update local store regardless of DB result
        if (profile) {
          setProfile({ ...profile, avatar_url: publicUrl });
        } else {
          setProfile({
            id: user.id,
            full_name: fullName || null,
            email: user.email || null,
            avatar_url: publicUrl,
            user_voice_id: null,
            custom_api_key: null,
            onboarding_complete: true,
            created_at: new Date().toISOString(),
          });
        }

        showToast('Avatar updated ✓', 'success');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to upload photo';
        showToast(msg, 'error');
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [user?.id, user?.email, fullName, profile, setProfile, showToast]
  );

  // Save profile name
  const saveProfile = useCallback(async () => {
    if (!user?.id) return;
    setIsSavingProfile(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            full_name: fullName.trim(),
          },
          { onConflict: 'id' }
        );

      if (error) throw error;

      if (profile) {
        setProfile({ ...profile, full_name: fullName.trim() });
      } else {
        setProfile({
          id: user.id,
          full_name: fullName.trim() || null,
          email: user.email || null,
          avatar_url: null,
          user_voice_id: null,
          custom_api_key: null,
          onboarding_complete: true,
          created_at: new Date().toISOString(),
        });
      }

      if (typeof window !== 'undefined' && displayName) {
        try {
          localStorage.setItem('vocalis_display_name', displayName.trim());
        } catch {}
      }

      showToast('Profile updated ✓', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not save profile';
      showToast(msg, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  }, [user, fullName, displayName, profile, setProfile, showToast]);

  // Test API key
  const testApiKey = useCallback(async (key: string) => {
    if (!key.trim()) {
      showToast('Please enter an API key first.', 'warning');
      return;
    }

    setIsTestingKey(true);
    setKeyTestStatus('idle');

    try {
      const subscription = await getUserInfo(key.trim());
      const info = detectKeyAccess({ subscription });
      setTestResult(info);
      setKeyTestStatus('success');
      showToast('ElevenLabs API Key Verified ✓', 'success');
    } catch {
      setKeyTestStatus('error');
      showToast('Invalid ElevenLabs API Key. Please verify.', 'error');
    } finally {
      setIsTestingKey(false);
    }
  }, [showToast]);

  // Sync profile custom_api_key when profile loads or updates
  useEffect(() => {
    if (profile?.custom_api_key !== undefined && profile?.custom_api_key !== null) {
      const timer = setTimeout(() => {
        setApiKeyInput(profile.custom_api_key || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile?.custom_api_key]);

  // Save API key
  const saveApiKey = useCallback(async () => {
    const supabase = createClient();
    setIsSavingKey(true);

    try {
      // 1. Resolve current user ID (from store or actively from Supabase session)
      let currentUserId = user?.id;
      if (!currentUserId) {
        const { data: authData } = await supabase.auth.getUser();
        currentUserId = authData?.user?.id;
      }

      if (!currentUserId) {
        throw new Error('Authentication required. Please log in again.');
      }

      const trimmedKey = apiKeyInput.trim();
      const keyValue = trimmedKey || null;

      // 2. Upsert Supabase profiles table targeting custom_api_key with onConflict: 'id'
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: currentUserId,
            custom_api_key: keyValue,
            email: user?.email || undefined,
            full_name: fullName || undefined,
            onboarding_complete: true,
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        console.warn('Supabase profiles upsert notice:', profileError.message || profileError);
      }

      // 3. Also persist in Supabase Auth user_metadata as a resilient fallback
      try {
        await supabase.auth.updateUser({
          data: { custom_api_key: keyValue },
        });
      } catch (authMetaErr) {
        console.warn('Auth user_metadata update notice:', authMetaErr);
      }

      // 4. Update local cache & store state
      if (typeof window !== 'undefined') {
        try {
          if (keyValue) {
            localStorage.setItem('vocalis_custom_api_key', keyValue);
          } else {
            localStorage.removeItem('vocalis_custom_api_key');
          }
        } catch {
          // ignore storage error
        }
      }

      if (profile) {
        setProfile({ ...profile, custom_api_key: keyValue });
      } else {
        setProfile({
          id: currentUserId,
          full_name: fullName || null,
          email: user?.email || null,
          avatar_url: null,
          user_voice_id: null,
          custom_api_key: keyValue,
          onboarding_complete: true,
          created_at: new Date().toISOString(),
        });
      }

      // If profiles update failed and error was NOT due to missing column, rethrow error
      if (profileError && profileError.code !== 'PGRST204' && profileError.code !== '42703') {
        throw profileError;
      }

      showToast('API Key saved ✓', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save API key';
      showToast(msg, 'error');
    } finally {
      setIsSavingKey(false);
    }
  }, [user, profile, fullName, apiKeyInput, setProfile, showToast]);

  // Toggle voice community sharing
  const toggleVoiceSharing = useCallback(
    async (isPublic: boolean) => {
      if (!profile?.user_voice_id) return;

      try {
        const supabase = createClient();
        await supabase
          .from('voice_templates')
          .update({ is_public: isPublic })
          .eq('elevenlabs_voice_id', profile.user_voice_id);

        setIsSharingVoice(isPublic);
        showToast(
          isPublic
            ? 'Voice shared with Community!'
            : 'Voice is now private.',
          'info'
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update voice privacy';
        showToast(msg, 'error');
      }
    },
    [profile, showToast]
  );

  // Delete voice model
  const deleteVoiceModel = useCallback(async () => {
    if (!profile?.user_voice_id) return;
    setIsDeletingVoice(true);

    try {
      const voiceId = profile.user_voice_id;
      const apiKey = profile.custom_api_key || '';

      try {
        await deleteVoice({ apiKey, voiceId });
      } catch (elErr) {
        console.warn('ElevenLabs remote delete notice:', elErr);
      }

      const supabase = createClient();
      await supabase
        .from('profiles')
        .update({ user_voice_id: null })
        .eq('id', user?.id || '');

      await supabase
        .from('voice_templates')
        .delete()
        .eq('elevenlabs_voice_id', voiceId);

      if (profile) {
        setProfile({ ...profile, user_voice_id: null });
      }

      showToast('Voice model deleted.', 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error deleting voice';
      showToast(msg, 'error');
    } finally {
      setIsDeletingVoice(false);
    }
  }, [profile, user, setProfile, showToast]);

  // Apply Theme Mode (light, dark, system)
  const applyThemeMode = useCallback(
    (mode: 'dark' | 'light' | 'system') => {
      setThemeMode(mode);
      try {
        localStorage.setItem('vocalis_theme_mode', mode);
      } catch {}

      if (mode === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      } else if (mode === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.classList.add('dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.classList.remove('dark');
        }
      }

      setStoreTheme(mode);
    },
    [setStoreTheme]
  );

  // Apply Accent Color
  const applyAccentColor = useCallback((hex: string, darkHex: string) => {
    setAccentColor(hex);
    try {
      localStorage.setItem('vocalis_accent', hex);
      document.documentElement.style.setProperty('--indigo', hex);
      document.documentElement.style.setProperty('--indigo-dark', darkHex);
      document.documentElement.style.setProperty('--indigo-glow', `${hex}25`);
    } catch {}
  }, []);

  return {
    fullName,
    setFullName,
    displayName,
    setDisplayName,
    isUploadingAvatar,
    uploadAvatar,
    isSavingProfile,
    saveProfile,
    apiKeyInput,
    setApiKeyInput,
    isTestingKey,
    keyTestStatus,
    testResult,
    testApiKey,
    isSavingKey,
    saveApiKey,
    isSharingVoice,
    toggleVoiceSharing,
    isDeletingVoice,
    deleteVoiceModel,
    themeMode,
    applyThemeMode,
    language,
    setLanguage,
    accentColor,
    applyAccentColor,
  };
}
