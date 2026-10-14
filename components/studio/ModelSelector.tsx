'use client';

import * as React from 'react';
import { Zap, Cpu, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModelOption {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
}

export const TTS_MODELS: ModelOption[] = [
  {
    id: 'eleven_turbo_v2_5',
    name: 'Turbo v2.5',
    subtitle: 'Fastest · Lowest latency',
    badge: 'Recommended',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'eleven_multilingual_v2',
    name: 'Multilingual v2',
    subtitle: 'Best quality · Supports 29 languages',
    badge: 'Best Quality',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    id: 'eleven_turbo_v2',
    name: 'Turbo v2',
    subtitle: 'Fast · English optimized',
  },
  {
    id: 'eleven_monolingual_v1',
    name: 'Monolingual v1',
    subtitle: 'Legacy · English only',
    badge: 'Legacy',
    badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
];

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export function ModelSelector({
  selectedModelId,
  onSelectModel,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const currentModel =
    TTS_MODELS.find((m) => m.id === selectedModelId) || TTS_MODELS[0];

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="w-full flex flex-col gap-1.5 select-none relative">
      <label className="text-xs font-semibold text-[#8899B4]">
        Generation Model
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[38px] sm:h-[40px] px-3 sm:px-3.5 rounded-[8px] sm:rounded-[10px] bg-[#111827] border border-[#1E293B] hover:border-[#2D3F56] transition-all flex items-center justify-between text-xs font-medium cursor-pointer"
      >
        <div className="flex items-center gap-2 text-[#F0F4FF]">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6366F1]" />
          <span className="font-semibold">{currentModel.name}</span>
          {currentModel.badge && (
            <span
              className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-medium border ml-1',
                currentModel.badgeColor
              )}
            >
              {currentModel.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8899B4] transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 p-1.5 rounded-[12px] bg-[#111827] border border-[#2D3F56] shadow-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
          {TTS_MODELS.map((model) => {
            const isSelected = model.id === currentModel.id;

            return (
              <div
                key={model.id}
                onClick={() => {
                  onSelectModel(model.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'p-2.5 rounded-[8px] flex items-center justify-between cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-[rgba(99,102,241,0.12)] text-[#F0F4FF]'
                    : 'hover:bg-[#1A2235] text-[#8899B4] hover:text-[#F0F4FF]'
                )}
              >
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F0F4FF]">
                      {model.name}
                    </span>
                    {model.badge && (
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded text-[10px] font-medium border',
                          model.badgeColor
                        )}
                      >
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#4B6080] mt-0.5">
                    {model.subtitle}
                  </span>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#6366F1] shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
