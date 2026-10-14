import * as React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

// 20 predefined bar heights (in px or percentage) for the decorative waveform
const waveformBars = [
  { height: 28, delay: '0s' },
  { height: 44, delay: '0.15s' },
  { height: 60, delay: '0.3s' },
  { height: 36, delay: '0.45s' },
  { height: 72, delay: '0.6s' },
  { height: 52, delay: '0.2s' },
  { height: 84, delay: '0.5s' },
  { height: 40, delay: '0.35s' },
  { height: 68, delay: '0.1s' },
  { height: 92, delay: '0.4s' },
  { height: 56, delay: '0.25s' },
  { height: 76, delay: '0.55s' },
  { height: 48, delay: '0.15s' },
  { height: 88, delay: '0.35s' },
  { height: 64, delay: '0.65s' },
  { height: 32, delay: '0.2s' },
  { height: 70, delay: '0.45s' },
  { height: 50, delay: '0.1s' },
  { height: 38, delay: '0.5s' },
  { height: 24, delay: '0.3s' },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[var(--bg-base)] text-[var(--text-1)] overflow-hidden">
      {/* Left Column (55% on desktop > 768px, hidden on mobile) */}
      <div className="hidden md:flex relative w-full md:w-[55%] bg-[#080C14] flex-col justify-between p-8 lg:p-14 overflow-hidden select-none">
        {/* Animated Radial Gradients (Pure CSS @keyframes, NO JS animation library) */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[520px] h-[520px] rounded-full pointer-events-none animate-glow-1"
          style={{
            background:
              'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute top-[35%] -right-[15%] w-[580px] h-[580px] rounded-full pointer-events-none animate-glow-2"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0) 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute -bottom-[15%] left-[25%] w-[480px] h-[480px] rounded-full pointer-events-none animate-glow-3"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0) 70%)',
            filter: 'blur(45px)',
          }}
        />

        {/* Top small brand watermark */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--indigo)] to-[var(--violet)] flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#F0F4FF]">
            Vocalis AI
          </span>
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 max-w-[540px] my-auto py-10 flex flex-col items-start">
          {/* Diamond / Sparkle SVG icon (indigo, 48px) */}
          <div className="w-12 h-12 rounded-2xl bg-[var(--indigo-glow)] border border-indigo-500/30 flex items-center justify-center mb-6 shadow-inner">
            <Sparkles className="w-7 h-7 text-[#6366F1]" />
          </div>

          <h1 className="font-bold text-4xl lg:text-[42px] leading-[1.15] text-[#F0F4FF] tracking-tight mb-4">
            Your Voice. Everywhere.
          </h1>

          <p className="text-base text-[#8899B4] leading-relaxed mb-8 max-w-[460px]">
            Clone your voice with AI precision and generate content in seconds.
          </p>

          {/* 3 Stat pills (row) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-[#1E293B] border border-[#2D3F56] text-[#F0F4FF] text-[13px] font-medium tracking-wide">
              2M+ Generated
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#1E293B] border border-[#2D3F56] text-[#F0F4FF] text-[13px] font-medium tracking-wide">
              99.2% Accuracy
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-[#1E293B] border border-[#2D3F56] text-[#F0F4FF] text-[13px] font-medium tracking-wide">
              &lt; 3s Generate
            </div>
          </div>
        </div>

        {/* Decorative Waveform Bars at bottom (CSS only) */}
        <div className="relative z-10 pt-6 border-t border-[#1E293B]/60">
          <div className="flex items-end gap-1.5 h-[80px]">
            {waveformBars.map((bar, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-full waveform-bar"
                style={{
                  height: `${bar.height}px`,
                  animationDelay: bar.delay,
                  background: 'linear-gradient(to top, #6366F1, #8B5CF6)',
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (45% on desktop > 768px, 100% on mobile < 768px) */}
      <div className="w-full md:w-[45%] bg-[#0D1117] md:border-l border-[#1E293B] flex items-center justify-center p-6 md:p-8 lg:p-12 min-h-screen">
        <div className="w-full max-w-[380px]">{children}</div>
      </div>
    </div>
  );
}
