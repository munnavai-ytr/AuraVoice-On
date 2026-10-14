'use client';

import * as React from 'react';
import { RotateCcw, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceSettingsPanelProps {
  stability: number;
  onStabilityChange: (value: number) => void;
  similarity: number;
  onSimilarityChange: (value: number) => void;
  style: number;
  onStyleChange: (value: number) => void;
  onReset: () => void;
}

interface SliderRowProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  tooltip: string;
}

function CustomSlider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  tooltip,
}: SliderRowProps) {
  const percent = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#8899B4] group relative">
          <span className="font-medium text-[#F0F4FF]">{label}</span>
          <HelpCircle className="w-3.5 h-3.5 text-[#4B6080] group-hover:text-[#8899B4] transition-colors cursor-help" />
          {/* Tooltip */}
          <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-30 w-52 p-2 rounded-lg bg-[#111827] border border-[#2D3F56] text-[11px] text-[#F0F4FF] shadow-xl pointer-events-none leading-relaxed">
            {tooltip}
          </div>
        </div>
        <span className="font-mono text-xs font-semibold text-[#818CF8]">
          {value.toFixed(2)}
        </span>
      </div>

      {/* Styled Slider Track */}
      <div className="relative w-full h-5 flex items-center">
        {/* Visual Track */}
        <div className="absolute left-0 right-0 h-[4px] rounded-[2px] bg-[#1A2235] pointer-events-none">
          <div
            className="h-full rounded-[2px]"
            style={{
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
            }}
          />
        </div>

        {/* Range Input with styled Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Visual Thumb Overlay */}
        <div
          className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#6366F1] shadow-md pointer-events-none transition-shadow -translate-x-1/2 hover:shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function VoiceSettingsPanel({
  stability,
  onStabilityChange,
  similarity,
  onSimilarityChange,
  style,
  onStyleChange,
  onReset,
}: VoiceSettingsPanelProps) {
  const [resetNotice, setResetNotice] = React.useState(false);

  const handleResetClick = () => {
    onReset();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 1200);
  };

  return (
    <div className="w-full p-3 sm:p-4 rounded-[10px] sm:rounded-[12px] bg-[#0D1117] border border-[#1E293B] flex flex-col gap-3 sm:gap-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]/60">
        <h4 className="text-xs sm:text-sm font-bold text-[#F0F4FF] tracking-tight">Voice Settings</h4>
        <button
          type="button"
          onClick={handleResetClick}
          className={cn(
            'flex items-center gap-1 text-[11px] sm:text-xs font-medium px-2 py-1 rounded-md transition-all cursor-pointer',
            resetNotice
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-[#8899B4] hover:text-[#F0F4FF] hover:bg-[#1A2235]'
          )}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{resetNotice ? 'Reset!' : 'Reset Defaults'}</span>
        </button>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-2.5 sm:gap-3.5">
        <CustomSlider
          label="Stability"
          value={stability}
          onChange={onStabilityChange}
          tooltip="Higher = more consistent and steady, Lower = more expressive and dynamic."
        />

        <CustomSlider
          label="Similarity"
          value={similarity}
          onChange={onSimilarityChange}
          tooltip="How closely the generation adheres to the timbre of the original voice."
        />

        <CustomSlider
          label="Style Exaggeration"
          value={style}
          onChange={onStyleChange}
          tooltip="Amplifies the speaker's natural style and affectations (recommended: 0.0)."
        />
      </div>
    </div>
  );
}
