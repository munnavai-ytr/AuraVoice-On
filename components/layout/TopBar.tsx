'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { useAppStore } from '@/store/useAppStore';

const pageTitles: Record<string, string> = {
  '/studio': 'Studio',
  '/voice-studio': 'Voice Studio',
  '/library': 'Audio Library',
  '/community': 'Voice Community',
  '/settings': 'Settings',
};

export function TopBar() {
  const pathname = usePathname();
  const { user, profile } = useAppStore();

  const currentTitle =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(([route]) => pathname.startsWith(route))?.[1] ||
    'Dashboard';

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <header className="h-[52px] sm:h-[56px] w-full fixed top-0 right-0 z-20 bg-[#0D1117]/90 backdrop-blur-md border-b border-[#1E293B] md:pl-[240px] transition-all duration-200 select-none">
      <div className="h-full px-3.5 sm:px-6 flex items-center justify-between">
        {/* Dynamic Page Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-[var(--text-1)] tracking-tight">
            {currentTitle}
          </h1>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell (future feature) */}
          <button
            type="button"
            aria-label="Notifications"
            className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center rounded-[6px] bg-[var(--bg-overlay)] hover:bg-[var(--border-hi)] border border-[var(--border-base)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors cursor-pointer relative"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--indigo)] absolute top-1.5 right-1.5 sm:top-2 sm:right-2" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* User Avatar */}
          <div className="pl-0.5 sm:pl-2">
            {profile?.avatar_url ? (
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#2D3F56]">
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-overlay)] border border-[#2D3F56] flex items-center justify-center text-[#8899B4]">
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
