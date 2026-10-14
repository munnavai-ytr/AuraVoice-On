'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore();
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Sync stored theme once on initial mount if present
  React.useEffect(() => {
    const stored = localStorage.getItem('vocalis_theme');
    if (stored === 'light' || stored === 'dark') {
      if (stored !== theme) {
        setTheme(stored);
      }
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  if (!isClient) {
    return (
      <div className="w-[36px] h-[36px] min-h-[36px] min-w-[36px] rounded-[6px] bg-[var(--bg-overlay)] border border-[var(--border-base)]" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-[36px] h-[36px] min-h-[36px] min-w-[36px] flex items-center justify-center rounded-[6px] bg-[var(--bg-overlay)] hover:bg-[var(--border-hi)] border border-[var(--border-base)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors cursor-pointer"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400" />
      )}
    </button>
  );
}
