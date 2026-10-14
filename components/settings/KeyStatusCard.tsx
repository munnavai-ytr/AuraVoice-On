'use client';

import * as React from 'react';
import { ExternalLink, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ELKeyInfo } from '@/types';

interface KeyStatusCardProps {
  keyInfo: ELKeyInfo | null;
}

export function KeyStatusCard({ keyInfo }: KeyStatusCardProps) {
  // Calculate days until reset if renewalDate is present
  const [daysUntilReset, setDaysUntilReset] = React.useState(14);

  React.useEffect(() => {
    if (keyInfo?.renewalDate) {
      const targetTime = keyInfo.renewalDate * 1000;
      const timer = setTimeout(() => {
        const days = Math.max(1, Math.ceil((targetTime - Date.now()) / (1000 * 60 * 60 * 24)));
        setDaysUntilReset(days);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [keyInfo?.renewalDate]);

  if (!keyInfo) return null;

  const {
    tier,
    characterLimit,
    charactersUsed,
    isFreeTier,
    canShareCommunity,
    maxScriptLength,
    renewalDate,
  } = keyInfo;

  const usagePercent =
    characterLimit > 0
      ? Math.min(Math.round((charactersUsed / characterLimit) * 100), 100)
      : 0;

  const barColor =
    usagePercent > 90
      ? 'bg-[#EF4444]'
      : usagePercent > 70
      ? 'bg-[#F59E0B]'
      : 'bg-[#10B981]';

  const planTitle = isFreeTier
    ? 'Free Tier Plan'
    : `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`;

  return (
    <div className="w-full p-3.5 sm:p-5 rounded-xl sm:rounded-[14px] bg-[#111827] border border-[#2D3F56] shadow-xl flex flex-col gap-3 sm:gap-4 text-left select-none">
      {/* Status Header */}
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2.5 h-2.5 rounded-full shrink-0',
              isFreeTier ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            )}
          />
          <h4 className="text-xs sm:text-sm font-bold text-[#F0F4FF]">{planTitle}</h4>
        </div>
        <span className="text-[10px] sm:text-[11px] text-[#8899B4] font-mono">
          Resets in {daysUntilReset} days
        </span>
      </div>

      {/* Characters Usage Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] sm:text-xs">
          <span className="text-[#8899B4]">Character Quota</span>
          <span className="font-mono text-[#F0F4FF]">
            {charactersUsed.toLocaleString()} / {characterLimit.toLocaleString()} ({usagePercent}%)
          </span>
        </div>
        <div className="w-full h-[6px] rounded-full bg-[#1A2235] overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', barColor)}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* Feature Access List */}
      <div className="flex flex-col gap-2 pt-2 border-t border-[#1E293B]/70">
        <span className="text-xs font-semibold text-[#8899B4]">Your Vocalis Access:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#8899B4]">
            <Check className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
            <span>Generate audio</span>
          </div>
          <div className="flex items-center gap-2 text-[#8899B4]">
            <Check className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
            <span>Clone voice (Instant model)</span>
          </div>
          <div className="flex items-center gap-2 text-[#8899B4]">
            <Check className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
            <span>Download MP3 with ID3</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-2',
              canShareCommunity ? 'text-[#8899B4]' : 'text-[#4B6080]'
            )}
          >
            {canShareCommunity ? (
              <Check className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
            ) : (
              <X className="w-4 h-4 text-[#2D3F56] shrink-0 stroke-[2.5]" />
            )}
            <span>Community template sharing</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-2',
              maxScriptLength >= 5000 ? 'text-[#8899B4]' : 'text-[#4B6080]'
            )}
          >
            {maxScriptLength >= 5000 ? (
              <Check className="w-4 h-4 text-[#10B981] shrink-0 stroke-[2.5]" />
            ) : (
              <X className="w-4 h-4 text-[#2D3F56] shrink-0 stroke-[2.5]" />
            )}
            <span>Full 5,000 char scripts</span>
          </div>
        </div>
      </div>

      {/* Upgrade Link */}
      <div className="pt-2">
        <a
          href="https://elevenlabs.io/pricing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#818CF8] transition-colors"
        >
          <span>Upgrade on ElevenLabs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
