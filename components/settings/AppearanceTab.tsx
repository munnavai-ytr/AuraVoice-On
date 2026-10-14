'use client';

import * as React from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { ACCENT_COLORS } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

interface AppearanceTabProps {
  themeMode: 'dark' | 'light' | 'system';
  onThemeModeChange: (mode: 'dark' | 'light' | 'system') => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  accentColor: string;
  onAccentColorChange: (hex: string, darkHex: string) => void;
}

export function AppearanceTab({
  themeMode,
  onThemeModeChange,
  language,
  onLanguageChange,
  accentColor,
  onAccentColorChange,
}: AppearanceTabProps) {
  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ] as const;

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 text-left select-none max-w-xl">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-[#F0F4FF]">Appearance</h3>
        <p className="text-xs text-[#8899B4] mt-0.5">
          Customize the interface look, accent colors, and language preferences.
        </p>
      </div>

      {/* Theme Selection */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold text-[#8899B4]">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => {
            const Icon = t.icon;
            const isActive = themeMode === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeModeChange(t.id)}
                className={cn(
                  'relative h-[72px] rounded-[10px] bg-[#111827] border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer',
                  isActive
                    ? 'border-[#6366F1] bg-[rgba(99,102,241,0.08)] shadow-sm'
                    : 'border-[#1E293B] hover:border-[#2D3F56]'
                )}
              >
                {isActive && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#6366F1] flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-[#818CF8]' : 'text-[#8899B4]'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-[#F0F4FF] font-semibold' : 'text-[#8899B4]'
                  )}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#8899B4]">Language</label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full sm:w-64 h-[44px] px-3.5 rounded-[10px] bg-[#111827] border border-[#1E293B] text-xs font-medium text-[#F0F4FF] outline-none cursor-pointer"
        >
          <option value="en">English (US)</option>
          <option value="bn">বাংলা (Bangla)</option>
        </select>
        <span className="text-[11px] text-[#4B6080]">
          Bengali language support preserves authentic phonetic cadence.
        </span>
      </div>

      {/* Accent Color Swatches */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold text-[#8899B4]">Accent Color</label>
        <div className="flex items-center gap-3">
          {ACCENT_COLORS.map((swatch) => {
            const isSelected = accentColor.toLowerCase() === swatch.hex.toLowerCase();

            return (
              <button
                key={swatch.name}
                type="button"
                onClick={() => onAccentColorChange(swatch.hex, swatch.darkHex)}
                title={swatch.name}
                className={cn(
                  'w-8 h-8 rounded-full transition-transform flex items-center justify-center cursor-pointer shadow-sm',
                  isSelected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0D1117]' : 'hover:scale-105'
                )}
                style={{ backgroundColor: swatch.hex }}
              >
                {isSelected && <Check className="w-4 h-4 text-white stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
