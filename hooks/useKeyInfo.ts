'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getUserInfo, detectKeyAccess } from '@/lib/elevenlabs';
import type { ELKeyInfo } from '@/types';

export function useKeyInfo() {
  const { profile } = useAppStore();
  const [keyInfo, setKeyInfo] = useState<ELKeyInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const customApiKey = profile?.custom_api_key || null;

  useEffect(() => {
    let isMounted = true;

    async function fetchKeyDetails() {
      setIsLoading(true);
      setError(null);

      try {
        // If user has custom_api_key, call getUserInfo with it, otherwise call server endpoint without key
        const subscription = await getUserInfo(customApiKey || '');
        if (isMounted) {
          const detected = detectKeyAccess({ subscription });
          setKeyInfo(detected);
        }
      } catch (err: unknown) {
        if (isMounted) {
          // If fetch fails, provide sensible default tier info
          setKeyInfo({
            tier: 'free',
            characterLimit: 10000,
            charactersUsed: 0,
            isFreeTier: true,
            canShareCommunity: false,
            maxScriptLength: 2500,
            renewalDate: null,
          });
          setError(err instanceof Error ? err.message : 'Could not detect subscription tier.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchKeyDetails();

    return () => {
      isMounted = false;
    };
  }, [customApiKey]);

  const hasCustomKey = Boolean(customApiKey);
  const characterLimit = keyInfo?.characterLimit || 10000;
  const charactersUsed = keyInfo?.charactersUsed || 0;
  const usagePercent = characterLimit > 0
    ? Math.min(Math.round((charactersUsed / characterLimit) * 100), 100)
    : 0;

  return {
    keyInfo,
    hasCustomKey,
    isFreeTier: keyInfo?.isFreeTier ?? true,
    maxScriptLength: keyInfo?.maxScriptLength || 2500,
    characterLimit,
    charactersUsed,
    usagePercent,
    isLoading,
    error,
  };
}
