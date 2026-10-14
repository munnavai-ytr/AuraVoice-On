'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Mic2,
  Radio,
  Library,
  Users,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';
import { useKeyInfo } from '@/hooks/useKeyInfo';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, reset } = useAppStore();
  const { keyInfo, hasCustomKey } = useKeyInfo();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const navItems = [
    { label: 'Studio', href: '/studio', icon: Mic2 },
    { label: 'Voice Studio', href: '/voice-studio', icon: Radio },
    { label: 'Library', href: '/library', icon: Library },
    { label: 'Community', href: '/community', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      reset();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      reset();
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const hasVoice = Boolean(profile?.user_voice_id);
  const voiceName = profile?.full_name ? `${profile.full_name}'s Voice` : 'My Voice';
  const tierName = keyInfo?.tier
    ? keyInfo.tier.charAt(0).toUpperCase() + keyInfo.tier.slice(1)
    : 'Free';

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User';

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen fixed left-0 top-0 bg-[#0D1117] border-r border-[#1E293B] z-30 select-none">
      {/* Top Logo Section */}
      <div className="p-[20px_16px] flex items-center justify-between border-b border-[#1E293B]/50">
        <Link href="/studio" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--indigo)] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--text-1)]">
            Vocalis AI
          </span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'h-[40px] px-3 rounded-[8px] flex items-center gap-2.5 transition-all duration-200 text-sm font-medium',
                isActive
                  ? 'bg-indigo-500/12 text-[#818CF8] border-l-[3px] border-[#6366F1] font-semibold pl-[9px]'
                  : 'text-[#8899B4] hover:bg-[#1A2235] hover:text-[#F0F4FF] border-l-[3px] border-transparent'
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Pinned Section */}
      <div className="p-3 border-t border-[#1E293B] flex flex-col gap-2 bg-[#0D1117]">
        {/* Voice Status Card */}
        <Link
          href="/voice-studio"
          className="p-2.5 bg-[#111827] border border-[#1E293B] rounded-xl hover:border-[#2D3F56] transition-all duration-200 group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                'w-2 h-2 rounded-full shrink-0',
                hasVoice ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              )}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[var(--text-1)] leading-tight truncate">
                {hasVoice ? 'Voice Ready' : 'Clone Your Voice'}
              </span>
              <span className="text-[10px] text-[#8899B4] truncate">
                {hasVoice ? voiceName : 'Setup 60s sample'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#4B6080] group-hover:text-[#F0F4FF] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* API Status Indicator */}
        <Link
          href="/settings"
          className="px-2.5 py-1.5 rounded-full bg-[#111827] border border-[#1E293B] hover:border-[#2D3F56] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full shrink-0',
                hasCustomKey ? 'bg-emerald-400' : 'bg-[#EF4444]'
              )}
            />
            <span className="text-[11px] font-medium text-[#8899B4]">
              {hasCustomKey ? `EL Connected (${tierName})` : 'No API Key'}
            </span>
          </div>
          <span className="text-[10px] text-[#6366F1] font-semibold">Settings</span>
        </Link>

        {/* PWA Install Button */}
        <PWAInstallButton variant="nav" />

        {/* User Profile Row */}
        <div className="pt-2 border-t border-[#1E293B]/60 flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            {profile?.avatar_url ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#2D3F56]">
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
              <div className="w-8 h-8 rounded-full bg-[var(--bg-overlay)] border border-[#2D3F56] flex items-center justify-center shrink-0 text-[#8899B4]">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-[var(--text-1)] truncate leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] text-[#4B6080] truncate">
                {user?.email || 'Logged in'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Log out"
            aria-label="Log out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8899B4] hover:text-[#EF4444] hover:bg-[#1A2235] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
