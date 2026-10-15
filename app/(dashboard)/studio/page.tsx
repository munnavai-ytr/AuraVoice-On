'use client';

import * as React from 'react';
import { AudioLines } from 'lucide-react';
import { useStudio } from '@/hooks/useStudio';
import { useKeyInfo } from '@/hooks/useKeyInfo';
import { ScriptEditor } from '@/components/studio/ScriptEditor';
import { EmotionTagBar } from '@/components/studio/EmotionTagBar';
import { VoiceSelector } from '@/components/studio/VoiceSelector';
import { VoiceSettingsPanel } from '@/components/studio/VoiceSettingsPanel';
import { ModelSelector } from '@/components/studio/ModelSelector';
import { KeyStatusBanner } from '@/components/studio/KeyStatusBanner';
import { CategorySelector } from '@/components/studio/CategorySelector';
import { GenerationErrorBanner } from '@/components/studio/GenerationErrorBanner';
import { GenerateButton } from '@/components/studio/GenerateButton';
import { AudioPlayerBar } from '@/components/studio/AudioPlayerBar';
import { cn } from '@/lib/utils';

export default function StudioPage() {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [mobileTab, setMobileTab] = React.useState<'script' | 'settings'>('script');

  const {
    script,
    setScript,
    activeTags,
    insertTag,
    clearAllTags,
    selectedVoiceId,
    selectedVoiceName,
    setSelectedVoice,
    voiceTab,
    setVoiceTab,
    stability,
    setStability,
    similarity,
    setSimilarity,
    style,
    setStyle,
    modelId,
    setModelId,
    category,
    setCategory,
    genStatus,
    audioUrl,
    audioBlob,
    audioDuration,
    genError,
    generateAudio,
    enhanceScript,
    isEnhancing,
    resetSettings,
  } = useStudio();

  const { maxScriptLength } = useKeyInfo();

  const isGenerateDisabled =
    !script.trim() || !selectedVoiceId || genStatus === 'generating';

  return (
    <div className="relative w-full h-[calc(100dvh-124px)] md:h-[calc(100vh-80px)] flex flex-col overflow-hidden pb-2 md:pb-24">
      {/* ── MOBILE TAB SWITCHER (< 768px) ── */}
      <div className="md:hidden flex items-center border-b border-[#1E293B] mb-2.5 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('script')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-all cursor-pointer',
            mobileTab === 'script'
              ? 'border-[#6366F1] text-[#F0F4FF]'
              : 'border-transparent text-[#8899B4]'
          )}
        >
          Script &amp; Tags
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('settings')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-all cursor-pointer',
            mobileTab === 'settings'
              ? 'border-[#6366F1] text-[#F0F4FF]'
              : 'border-transparent text-[#8899B4]'
          )}
        >
          Voice &amp; Settings
        </button>
      </div>

      {/* ── DESKTOP & TABLET TWO-PANEL SPLIT ── */}
      <div className="flex-1 flex flex-col md:flex-row gap-3.5 sm:gap-4 md:gap-5 min-h-0 overflow-hidden">
        {/* ── LEFT PANEL (60% width on Desktop, full height flex-1) ── */}
        <div
          className={cn(
            'flex-col flex-1 md:w-[60%] min-h-0 h-full overflow-y-auto pr-0 sm:pr-1',
            mobileTab === 'script' ? 'flex' : 'hidden md:flex'
          )}
        >
          {/* Top Banner (Free Tier / Add API Key) */}
          <KeyStatusBanner />

          {/* Emotion Tag Buttons Toolbar */}
          <EmotionTagBar
            activeTags={activeTags}
            onTagClick={(tag) => insertTag(tag, textareaRef)}
            onClearTags={clearAllTags}
          />

          {/* Script Editor with Character Counter & Est. Duration */}
          <div className="flex-1 flex flex-col min-h-0 mt-1.5 sm:mt-2">
            <ScriptEditor
              script={script}
              onChange={setScript}
              maxLength={maxScriptLength}
              textareaRef={textareaRef}
              onEnhance={enhanceScript}
              isEnhancing={isEnhancing}
              category={category}
            />
          </div>
        </div>

        {/* ── RIGHT PANEL (40% width on Desktop, scrollable settings) ── */}
        <div
          className={cn(
            'flex-col md:w-[40%] min-h-0 h-full overflow-y-auto pl-0 sm:pl-1 gap-3 sm:gap-4 md:gap-4.5 pb-4',
            mobileTab === 'settings' ? 'flex' : 'hidden md:flex'
          )}
        >
          {/* Voice Selector (My Voice / Community Tabs) */}
          <VoiceSelector
            selectedVoiceId={selectedVoiceId}
            onSelectVoice={(id, name) => {
              setSelectedVoice(id, name);
            }}
            voiceTab={voiceTab}
            onTabChange={setVoiceTab}
          />

          {/* Voice Settings Sliders Panel */}
          <VoiceSettingsPanel
            stability={stability}
            onStabilityChange={setStability}
            similarity={similarity}
            onSimilarityChange={setSimilarity}
            style={style}
            onStyleChange={setStyle}
            onReset={resetSettings}
          />

          {/* Model Selector Dropdown */}
          <ModelSelector
            selectedModelId={modelId}
            onSelectModel={setModelId}
          />

          {/* Category Selector */}
          <CategorySelector
            selectedCategory={category}
            onSelectCategory={setCategory}
          />

          {/* Error Banner */}
          {genError && (
            <GenerationErrorBanner error={genError} />
          )}

          {/* Generate Button (Sticky / Bottom of Right Panel) */}
          <div className="mt-auto pt-2">
            <GenerateButton
              status={genStatus}
              isDisabled={isGenerateDisabled}
              onClick={generateAudio}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE FLOATING ACTION BUTTON (FAB) (< 768px when on script tab) ── */}
      <div className="md:hidden fixed bottom-[68px] right-3.5 z-30">
        <button
          type="button"
          onClick={generateAudio}
          disabled={isGenerateDisabled}
          aria-label="Generate Audio"
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform active:scale-95',
            isGenerateDisabled
              ? 'bg-[#1A2235] text-[#4B6080] cursor-not-allowed border border-[#1E293B]'
              : 'bg-[#6366F1] shadow-indigo-500/40 cursor-pointer'
          )}
        >
          <AudioLines className="w-5 h-5" />
        </button>
      </div>

      {/* ── BOTTOM AUDIO PLAYER BAR (Slides up after first generation) ── */}
      <AudioPlayerBar
        audioUrl={audioUrl}
        audioBlob={audioBlob}
        title={script ? script.slice(0, 40) : selectedVoiceName}
        durationSeconds={audioDuration}
      />
    </div>
  );
}
