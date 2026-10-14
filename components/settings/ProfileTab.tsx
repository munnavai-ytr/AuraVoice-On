'use client';

import * as React from 'react';
import Image from 'next/image';
import { User, Lock, Upload, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ProfileTabProps {
  fullName: string;
  onFullNameChange: (val: string) => void;
  displayName: string;
  onDisplayNameChange: (val: string) => void;
  onUploadAvatar: (file: File) => Promise<void>;
  isUploadingAvatar: boolean;
  onSaveProfile: () => Promise<void>;
  isSavingProfile: boolean;
}

export function ProfileTab({
  fullName,
  onFullNameChange,
  displayName,
  onDisplayNameChange,
  onUploadAvatar,
  isUploadingAvatar,
  onSaveProfile,
  isSavingProfile,
}: ProfileTabProps) {
  const { user, profile } = useAppStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadAvatar(file);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 text-left select-none max-w-xl">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-[#F0F4FF]">Profile Information</h3>
        <p className="text-xs text-[#8899B4] mt-0.5">
          Manage your personal details and how you appear across Vocalis AI.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#111827] border border-[#1E293B]">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#2D3F56]">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={64}
              height={64}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-[#1A2235] flex items-center justify-center text-[#8899B4]">
              <User className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          )}

          {isUploadingAvatar && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#818CF8] cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Change Photo</span>
          </button>
          <span className="text-[10px] sm:text-[11px] text-[#4B6080]">
            Square JPG, PNG, or WebP (max 5MB, auto-compressed to 256×256)
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-3.5 sm:gap-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="e.g. Alex Rivera"
        />

        {/* Email (Disabled / Read-only) */}
        <div className="w-full flex flex-col gap-1.5 text-left">
          <label className="text-xs font-medium text-[var(--text-2)]">Email Address</label>
          <div className="relative flex items-center">
            <input
              type="email"
              disabled
              value={user?.email || profile?.email || ''}
              className="w-full h-[42px] sm:h-[48px] px-3 sm:px-3.5 pr-10 bg-[#0D1117] border border-[#1E293B] rounded-[8px] sm:rounded-[10px] text-[#8899B4] text-xs sm:text-sm cursor-not-allowed outline-none"
            />
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4B6080] absolute right-3 sm:right-3.5 pointer-events-none" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#4B6080]">Email cannot be changed</span>
        </div>

        {/* Display Name (Optional) */}
        <Input
          label="Display Name (optional)"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          placeholder="How others see you in Community"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="md"
          isLoading={isSavingProfile}
          onClick={onSaveProfile}
          className="w-full sm:w-[160px]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
