'use client';

import * as React from 'react';
import Link from 'next/link';
import { Zap, Key, X, ExternalLink, ArrowRight } from 'lucide-react';
import { useKeyInfo } from '@/hooks/useKeyInfo';
import { cn } from '@/lib/utils';

export function KeyStatusBanner() {
  const {
    hasCustomKey,
    isFreeTier,
    characterLimit,
    charactersUsed,
    usagePercent,
  } = useKeyInfo();

  const [isDismissedByUser, setIsDismissedByUser] = React.useState(false);

  const isSessionDismissed = React.useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem('vocalis_dismiss_key_banner') === 'true';
      } catch {
        return false;
      }
    },
    () => false
  );

  const handleDismiss = () => {
    setIsDismissedByUser(true);
    try {
      sessionStorage.setItem('vocalis_dismiss_key_banner', 'true');
    } catch {}
  };

  if (isSessionDismissed || isDismissedByUser) return null;

  // Case 1: No custom API key added yet -> Blue banner
  if (!hasCustomKey) {
    return (
      <div className="w-full p-2.5 sm:px-3.5 rounded-[10px] bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.25)] flex items-center justify-between gap-3 text-xs mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Key className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-[#F0F4FF] truncate">
            Add your ElevenLabs API key in Settings for unlimited access
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Add Key</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 text-[#8899B4] hover:text-[#F0F4FF] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Custom API key is free tier -> Amber banner with usage bar
  if (isFreeTier) {
    const barColor =
      usagePercent > 90
        ? 'bg-[#EF4444]'
        : usagePercent > 70
        ? 'bg-[#F59E0B]'
        : 'bg-[#10B981]';

    return (
      <div className="w-full p-2.5 sm:px-3.5 rounded-[10px] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs mb-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Zap className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1 min-w-0">
            <span className="text-[#F0F4FF] font-medium shrink-0">
              Free Tier · {charactersUsed.toLocaleString()} / {characterLimit.toLocaleString()} characters used
            </span>

            {/* Usage Progress Bar */}
            <div className="w-full max-w-[140px] h-[4px] rounded-[2px] bg-[#1A2235] overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', barColor)}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <a
            href="https://elevenlabs.io/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#F59E0B] hover:text-amber-300 transition-colors"
          >
            <span>Upgrade</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 text-[#8899B4] hover:text-[#F0F4FF] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
