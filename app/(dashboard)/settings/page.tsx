'use client';

import * as React from 'react';
import { User, Key, Radio, Moon } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { ApiKeyTab } from '@/components/settings/ApiKeyTab';
import { VoiceModelTab } from '@/components/settings/VoiceModelTab';
import { AppearanceTab } from '@/components/settings/AppearanceTab';
import { cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'api-keys' | 'voice-model' | 'appearance';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('profile');

  const {
    fullName,
    setFullName,
    displayName,
    setDisplayName,
    isUploadingAvatar,
    uploadAvatar,
    isSavingProfile,
    saveProfile,
    apiKeyInput,
    setApiKeyInput,
    isTestingKey,
    keyTestStatus,
    testResult,
    testApiKey,
    isSavingKey,
    saveApiKey,
    isSharingVoice,
    toggleVoiceSharing,
    isDeletingVoice,
    deleteVoiceModel,
    themeMode,
    applyThemeMode,
    language,
    setLanguage,
    accentColor,
    applyAccentColor,
  } = useSettings();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'voice-model', label: 'Voice Model', icon: Radio },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-6 text-left">
      {/* Page Header */}
      <div className="pb-3 sm:pb-4 border-b border-[#1E293B]">
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#F0F4FF]">
          Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#8899B4] mt-0.5">
          Manage your profile, ElevenLabs API integrations, voice models, and theme preferences.
        </p>
      </div>

      {/* Main Settings Layout */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-start pt-1">
        {/* Mobile Horizontal Tabs */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto no-scrollbar w-full border-b border-[#1E293B] pb-1.5 sm:pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                  isActive
                    ? 'bg-indigo-500/12 text-[#818CF8]'
                    : 'text-[#8899B4] hover:text-[#F0F4FF]'
                )}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Vertical Tab List (200px) */}
        <div className="hidden md:flex flex-col w-[200px] shrink-0 gap-1 select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  'h-[40px] px-3.5 rounded-[8px] flex items-center gap-2.5 text-xs font-semibold transition-all cursor-pointer border-l-3',
                  isActive
                    ? 'bg-indigo-500/12 text-[#818CF8] border-[#6366F1]'
                    : 'text-[#8899B4] hover:bg-[#1A2235] hover:text-[#F0F4FF] border-transparent'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 w-full min-w-0">
          {activeTab === 'profile' && (
            <ProfileTab
              fullName={fullName}
              onFullNameChange={setFullName}
              displayName={displayName}
              onDisplayNameChange={setDisplayName}
              onUploadAvatar={uploadAvatar}
              isUploadingAvatar={isUploadingAvatar}
              onSaveProfile={saveProfile}
              isSavingProfile={isSavingProfile}
            />
          )}

          {activeTab === 'api-keys' && (
            <ApiKeyTab
              apiKey={apiKeyInput}
              onApiKeyChange={setApiKeyInput}
              onTestKey={testApiKey}
              isTesting={isTestingKey}
              testStatus={keyTestStatus}
              testResult={testResult}
              onSaveKey={saveApiKey}
              isSaving={isSavingKey}
            />
          )}

          {activeTab === 'voice-model' && (
            <VoiceModelTab
              isSharingVoice={isSharingVoice}
              onToggleSharing={toggleVoiceSharing}
              isDeletingVoice={isDeletingVoice}
              onDeleteVoice={deleteVoiceModel}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceTab
              themeMode={themeMode}
              onThemeModeChange={applyThemeMode}
              language={language}
              onLanguageChange={setLanguage}
              accentColor={accentColor}
              onAccentColorChange={applyAccentColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}
