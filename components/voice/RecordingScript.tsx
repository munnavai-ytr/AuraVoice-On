'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export const RECORDING_SCRIPT = [
  {
    id: 1,
    en: "Hello, my name is [pause] and I'm recording this to create my personal AI voice model.",
    bn: "হ্যালো, আমার নাম [বিরতি] এবং আমি আমার ব্যক্তিগত এআই ভয়েস মডেল তৈরি করতে এটি রেকর্ড করছি।",
  },
  {
    id: 2,
    en: "The quick brown fox jumps over the lazy dog near the riverbank.",
    bn: "দ্রুত বাদামী শিয়াল নদীর তীরের কাছে অলস কুকুরের উপর দিয়ে লাফিয়ে পড়ে।",
  },
  {
    id: 3,
    en: "I love creating content for my audience. Every video tells a story.",
    bn: "আমি আমার দর্শকদের জন্য কন্টেন্ট তৈরি করতে ভালোবাসি। প্রতিটি ভিডিও একটি গল্প বলে।",
  },
  {
    id: 4,
    en: "Technology helps us connect with people around the world in meaningful ways.",
    bn: "প্রযুক্তি আমাদের অর্থবহভাবে বিশ্বের মানুষের সাথে সংযুক্ত হতে সাহায্য করে।",
  },
  {
    id: 5,
    en: "Please subscribe to my channel and hit the notification bell for updates.",
    bn: "আমার চ্যানেলে সাবস্ক্রাইব করুন এবং আপডেটের জন্য নোটিফিকেশন বেল চাপুন।",
  },
  {
    id: 6,
    en: "Today we're going to explore something fascinating together. Are you ready?",
    bn: "আজ আমরা একসাথে কিছু আকর্ষণীয় জিনিস অন্বেষণ করতে যাচ্ছি। আপনি কি প্রস্তুত?",
  },
  {
    id: 7,
    en: "Thank you so much for watching. I'll see you in the next video.",
    bn: "দেখার জন্য অনেক ধন্যবাদ। পরের ভিডিওতে আবার দেখা হবে।"
  },
];

interface RecordingScriptProps {
  duration: number;
  isRecording: boolean;
}

export function RecordingScript({ duration, isRecording }: RecordingScriptProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Calculate active index directly from duration during recording
  const [manualIndex, setManualIndex] = React.useState<number | null>(null);

  const calculatedIndex = Math.min(
    Math.floor(duration / 12),
    RECORDING_SCRIPT.length - 1
  );

  const activeIndex = isRecording
    ? calculatedIndex
    : manualIndex ?? calculatedIndex;

  // Smooth scroll into view whenever activeIndex changes
  React.useEffect(() => {
    const targetElement = itemRefs.current[activeIndex];
    if (targetElement && containerRef.current) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  return (
    <div className="w-full flex flex-col rounded-[16px] bg-[#0D1117] border border-[#1E293B] overflow-hidden shadow-inner">
      {/* Header with sentence counter & reading instruction */}
      <div className="px-4 py-2.5 border-b border-[#1E293B] bg-[#111827]/60 flex items-center justify-between text-xs">
        <span className="text-[#8899B4] font-medium">
          Sentence {activeIndex + 1} of {RECORDING_SCRIPT.length}
        </span>
        <span className="text-[#4B6080]">
          Read in English or Bangla with natural tone
        </span>
      </div>

      {/* Script list with smooth scroll */}
      <div
        ref={containerRef}
        className="max-h-[260px] sm:max-h-[290px] overflow-y-auto p-3 sm:p-4 space-y-2.5 scroll-smooth"
      >
        {RECORDING_SCRIPT.map((item, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => {
                if (!isRecording) {
                  setManualIndex(idx);
                }
              }}
              className={cn(
                'p-3.5 rounded-[12px] transition-all duration-300 cursor-pointer select-none text-left',
                isActive
                  ? 'bg-[rgba(99,102,241,0.10)] border-l-[3px] border-l-[#6366F1] shadow-sm'
                  : 'bg-transparent border-l-[3px] border-l-transparent hover:bg-[#111827]'
              )}
            >
              {/* English sentence */}
              <p
                className={cn(
                  'font-inter transition-colors duration-200',
                  isActive
                    ? 'text-[#F0F4FF] font-medium text-[17px] sm:text-[18px] leading-snug'
                    : 'text-[#4B6080] text-[15px] sm:text-[16px] leading-normal'
                )}
              >
                {item.en}
              </p>

              {/* Bangla translation (Hind Siliguri font, slightly larger line-height) */}
              <p
                className={cn(
                  'font-hind-siliguri mt-1.5 transition-colors duration-200 leading-[1.65]',
                  isActive
                    ? 'text-[#C7D2FE] text-[15px] sm:text-[16px]'
                    : 'text-[#3E4F69] text-[13px] sm:text-[14px]'
                )}
              >
                {item.bn}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
