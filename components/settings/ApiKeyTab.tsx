'use client';

import * as React from 'react';
import { Eye, EyeOff, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { KeyStatusCard } from './KeyStatusCard';
import { useKeyInfo } from '@/hooks/useKeyInfo';
import type { ELKeyInfo } from '@/types';

interface ApiKeyTabProps {
  apiKey: string;
  onApiKeyChange: (val: string) => void;
  onTestKey: (key: string) => Promise<void>;
  isTesting: boolean;
  testStatus: 'idle' | 'success' | 'error';
  testResult: ELKeyInfo | null;
  onSaveKey: () => Promise<void>;
  isSaving: boolean;
}

export function ApiKeyTab({
  apiKey,
  onApiKeyChange,
  onTestKey,
  isTesting,
  testStatus,
  testResult,
  onSaveKey,
  isSaving,
}: ApiKeyTabProps) {
  const [showKey, setShowKey] = React.useState(false);
  const { keyInfo: currentKeyInfo } = useKeyInfo();

  const activeInfo = testResult || currentKeyInfo;

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 text-left select-none max-w-xl">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-[#F0F4FF]">ElevenLabs API Key</h3>
        <p className="text-xs text-[#8899B4] mt-0.5">
          Add your ElevenLabs API key for unlimited generation. Your key is stored securely in your profile.
        </p>
      </div>

      {/* Input Row */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[#8899B4]">Personal API Key</label>
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="sk_..."
              className="w-full h-[40px] sm:h-[44px] px-3 sm:px-3.5 pr-14 sm:pr-16 rounded-[8px] sm:rounded-[10px] bg-[#111827] border border-[#1E293B] text-xs sm:text-sm font-mono text-[#F0F4FF] placeholder-[#4B6080] outline-none transition-all focus:border-[#6366F1]"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[#4B6080]">
              {apiKey && (
                <button
                  type="button"
                  onClick={() => onApiKeyChange('')}
                  className="p-1 hover:text-[#F0F4FF] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1 hover:text-[#F0F4FF] cursor-pointer"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            disabled={isTesting || !apiKey}
            onClick={() => onTestKey(apiKey)}
            className="w-full sm:w-auto h-[40px] sm:h-[44px] shrink-0"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#6366F1]" />
                <span>Testing...</span>
              </>
            ) : testStatus === 'success' ? (
              <>
                <Check className="w-4 h-4 mr-1.5 text-emerald-400 stroke-[2.5]" />
                <span className="text-emerald-400 font-semibold">Connected</span>
              </>
            ) : testStatus === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4 mr-1.5 text-red-400" />
                <span className="text-red-400 font-semibold">Invalid Key</span>
              </>
            ) : (
              <span>Test Connection</span>
            )}
          </Button>
        </div>

        {/* Plan Requirements Note */}
        <div className="mt-3 p-3 rounded-lg bg-[#111827] border border-[#1E293B] text-xs text-[#8899B4] leading-relaxed">
          <p className="font-semibold text-[#F0F4FF] mb-1">📋 ElevenLabs Plan Requirements:</p>
          <p>• <span className="text-red-400">Free trial</span> — Voice cloning <strong>হবে না</strong>, শুধু pre-made voice দিয়ে audio generate হবে</p>
          <p>• <span className="text-amber-400">Starter ($5/mo)</span> — Voice cloning ✓, ৩০,০০০ chars/month</p>
          <p>• <span className="text-green-400">Creator ($22/mo)</span> — Voice cloning ✓, ১,০০,০০০ chars/month</p>
          <p className="mt-2 text-[#6B7280]">API key নিন: <span className="text-indigo-400">elevenlabs.io → Profile → API Keys</span></p>
        </div>
      </div>

      {/* Key Status Card */}
      {activeInfo && <KeyStatusCard keyInfo={activeInfo} />}

      {/* Save Button */}
      <div>
        <Button
          variant="primary"
          size="md"
          isLoading={isSaving}
          onClick={onSaveKey}
          className="w-full sm:w-[160px]"
        >
          Save API Key
        </Button>
      </div>
    </div>
  );
}
