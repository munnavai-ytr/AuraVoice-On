'use client';

import * as React from 'react';

interface VolumeMeterProps {
  audioLevel: number;
  isRecording: boolean;
}

// 12 bar sensitivity profiles for natural audio movement
const BAR_MULTIPLIERS = [0.45, 0.65, 0.85, 1.1, 1.3, 1.45, 1.4, 1.25, 0.95, 0.75, 0.55, 0.4];

export function VolumeMeter({ audioLevel, isRecording }: VolumeMeterProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 h-[36px] my-3">
      {BAR_MULTIPLIERS.map((multiplier, idx) => {
        // Calculate dynamic height between 4px and 32px
        const dynamicLevel = isRecording ? Math.min(audioLevel * multiplier, 1) : 0;
        const heightPx = Math.max(4, Math.round(dynamicLevel * 32));
        const isActive = isRecording && dynamicLevel > 0.05;

        return (
          <div
            key={idx}
            className="w-[4px] rounded-[2px] transition-all duration-75"
            style={{
              height: `${heightPx}px`,
              background: isActive
                ? 'linear-gradient(to top, #6366F1, #8B5CF6)'
                : '#1E293B',
              boxShadow: isActive ? '0 0 6px rgba(99,102,241,0.4)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
