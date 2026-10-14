'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useAppStore } from '@/store/useAppStore';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUser, setProfile, setIsLoading } = useAppStore();
  const [sessionChecked, setSessionChecked] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (user) {
          setUser(user);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData && isMounted) {
            setProfile(profileData as Profile);
          }
        }
      } catch (err) {
        console.error('Error checking user session in dashboard:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setSessionChecked(true);
        }
      }
    }

    loadUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        router.push('/login');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, setUser, setProfile, setIsLoading]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-1)]">
      {/* Fixed Sidebar for desktop */}
      <Sidebar />

      {/* TopBar with Page Title, Theme Toggle, Profile */}
      <TopBar />

      {/* Main Content Area */}
      <main className="md:pl-[240px] pt-[52px] sm:pt-[56px] pb-[72px] md:pb-6 min-h-screen">
        <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation for Mobile */}
      <MobileNav />
    </div>
  );
}
