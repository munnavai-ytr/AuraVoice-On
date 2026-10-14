'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic2, Radio, Library, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Studio', href: '/studio', icon: Mic2 },
    { label: 'Voice', href: '/voice-studio', icon: Radio },
    { label: 'Library', href: '/library', icon: Library },
    { label: 'Community', href: '/community', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0D1117] border-t border-[#1E293B] pb-[env(safe-area-inset-bottom)] select-none">
      <div className="flex items-center justify-around h-[54px] sm:h-[58px] px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center min-h-[44px] sm:min-h-[48px] py-1 transition-colors duration-200 cursor-pointer',
                isActive
                  ? 'text-[var(--indigo)]'
                  : 'text-[#4B6080] hover:text-[#8899B4]'
              )}
            >
              <Icon className="w-[19px] h-[19px] sm:w-[22px] sm:h-[22px] mb-0.5" />
              <span
                className={cn(
                  'text-[10px] tracking-tight font-medium',
                  isActive ? 'text-[var(--indigo)] font-semibold' : 'text-[#4B6080]'
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
