'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Globe,
  Radio,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface VoiceModelTabProps {
  isSharingVoice: boolean;
  onToggleSharing: (isPublic: boolean) => Promise<void>;
  isDeletingVoice: boolean;
  onDeleteVoice: () => Promise<void>;
}

export function VoiceModelTab({
  isSharingVoice,
  onToggleSharing,
  isDeletingVoice,
  onDeleteVoice,
}: VoiceModelTabProps) {
  const router = useRouter();
  const { profile } = useAppStore();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const hasVoice = Boolean(profile?.user_voice_id);
  const voiceName = profile?.full_name ? `${profile.full_name}'s Voice` : 'My Voice';

  const handleToggleClick = () => {
    if (!isSharingVoice) {
      setShowShareModal(true);
    } else {
      onToggleSharing(false);
    }
  };

  const handleConfirmShare = async () => {
    setShowShareModal(false);
    await onToggleSharing(true);
  };

  const handleDeleteConfirm = async () => {
    await onDeleteVoice();
    setShowDeleteModal(false);
  };

  if (!hasVoice) {
    return (
      <div className="w-full py-16 px-4 rounded-2xl bg-[#0D1117] border border-[#1E293B] text-center flex flex-col items-center justify-center select-none max-w-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#1A2235] flex items-center justify-center mb-4 text-[#8899B4]">
          <Mic className="w-8 h-8 text-[#2D3F56]" />
        </div>
        <h4 className="text-base font-bold text-[#F0F4FF] mb-1">No voice model yet</h4>
        <p className="text-xs text-[#8899B4] max-w-xs mb-6 leading-relaxed">
          Record a 60-second voice sample to clone your personal AI voice model.
        </p>
        <Link href="/voice-studio">
          <Button variant="primary" size="md">
            <span>Clone Your Voice</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 text-left select-none max-w-xl">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-[#F0F4FF]">Voice Model Settings</h3>
        <p className="text-xs text-[#8899B4] mt-0.5">
          Manage your neural voice model, test synthesis, and manage sharing permissions.
        </p>
      </div>

      {/* Voice Card (Large) */}
      <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-[14px] bg-[#111827] border border-[#2D3F56] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-[#6366F1]">
            <Radio className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#F0F4FF]">{voiceName}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#10B981] font-semibold">
                ● Active
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#8899B4] mt-0.5 font-mono">
              ID: {profile?.user_voice_id?.slice(0, 14)}...
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-8 px-3 text-xs w-full sm:w-auto"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 mr-1.5 text-[#6366F1]" />
              <span>Playing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 mr-1.5 fill-current text-[#6366F1]" />
              <span>Preview Voice</span>
            </>
          )}
        </Button>
      </div>

      {/* Privacy Toggle: Share with Community */}
      <div className="p-3 sm:p-4 rounded-xl bg-[#111827] border border-[#1E293B] flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-0.5 max-w-sm">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-[#F0F4FF]">Share with Community</span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#8899B4] leading-relaxed">
            When enabled, other users can discover and use your voice in their content creation.
          </span>
        </div>

        {/* Toggle Switch (44px x 24px) */}
        <button
          type="button"
          onClick={handleToggleClick}
          aria-label="Toggle community sharing"
          className={cn(
            'w-[44px] h-[24px] rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 relative',
            isSharingVoice ? 'bg-[#6366F1]' : 'bg-[#1A2235]'
          )}
        >
          <div
            className={cn(
              'w-[20px] h-[20px] rounded-full bg-white transition-transform duration-200 shadow-sm',
              isSharingVoice ? 'translate-x-[20px]' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {/* Action: Re-clone Voice */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-[#F0F4FF]">Re-clone Voice</span>
          <span className="text-[11px] text-[#8899B4]">
            Record a new sample to recalibrate intonation and tone.
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push('/voice-studio')}
          className="h-8 px-3 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>Re-clone</span>
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/5 flex flex-col gap-3">
        <span className="text-xs font-bold text-[#EF4444]">Danger Zone</span>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-[#8899B4]">
            Permanently delete your AI voice model from ElevenLabs and your account.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="h-8 px-3 text-xs text-[#EF4444] border-red-500/40 hover:bg-red-500/10 shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Delete Model</span>
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Community Sharing */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0D1117] border border-[#1E293B] shadow-2xl text-left">
            <h4 className="text-base font-bold text-[#F0F4FF] mb-2">Make your voice public?</h4>
            <p className="text-xs text-[#8899B4] leading-relaxed mb-6">
              Other users will be able to discover and use your voice to generate audio content. You can make it private again at any time.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmShare}>
                Yes, share it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Voice */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0D1117] border border-red-500/30 shadow-2xl text-left">
            <div className="flex items-center gap-2 text-[#EF4444] mb-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-base font-bold text-[#F0F4FF]">Delete Voice Model?</h4>
            </div>
            <p className="text-xs text-[#8899B4] leading-relaxed mb-6">
              This will permanently delete your voice model from ElevenLabs. This action cannot be undone.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeletingVoice}
                onClick={handleDeleteConfirm}
              >
                Delete Forever
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
