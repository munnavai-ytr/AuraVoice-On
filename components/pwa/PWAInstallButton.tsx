'use client';

import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'header' | 'button' }> = ({
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as PWA or in standalone mode
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'nav') {
      return (
        <button
          onClick={install}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
        >
          <Download className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Install Web App</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-2)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:text-white hover:border-[var(--border-strong)] transition-all"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0F172A] border border-[#1E293B] p-6 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
                <Download className="w-5 h-5" />
              </div>

              <h3 className="text-base font-semibold text-white">Install on iPhone / iPad</h3>
              <p className="mt-1 text-xs text-slate-400">
                Install Vocalis AI directly to your home screen for an offline-ready, full-screen app experience.
              </p>

              <div className="mt-4 space-y-3 text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Tap the <strong className="text-white inline-flex items-center gap-1">Share <Share className="w-3 h-3 text-indigo-400 inline" /></strong> button in the Safari bottom bar.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-bold shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Scroll down and select <strong className="text-white inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3 h-3 text-indigo-400 inline" /></strong>.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
