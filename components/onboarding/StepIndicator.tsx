'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-4 h-[2px] bg-[#1E293B] -z-0" />
        
        {/* Active progress track */}
        <div
          className="absolute left-6 top-4 h-[2px] bg-indigo-500 transition-all duration-300 -z-0"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        {stepTitles.map((title, idx) => {
          const stepNumber = idx + 1;
          const isDone = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={title} className="flex flex-col items-center z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2',
                  isDone
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : isCurrent
                    ? 'bg-[#0D1117] border-indigo-500 text-indigo-400 ring-4 ring-indigo-500/20'
                    : 'bg-[#0D1117] border-[#1E293B] text-[#8899B4]'
                )}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[2.5]" /> : stepNumber}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium text-center whitespace-nowrap',
                  isCurrent ? 'text-white' : isDone ? 'text-indigo-400' : 'text-[#8899B4]'
                )}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
