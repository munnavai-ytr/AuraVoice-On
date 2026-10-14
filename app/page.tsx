'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Mic,
  Sparkles,
  ArrowRight,
  AudioWaveform,
  Shield,
  Layers,
  Zap,
  Play,
  Volume2,
  CheckCircle,
  Radio,
  Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PWAInstallButton } from '@/components/pwa/PWAInstallButton';

export default function LandingPage() {
  const [isPlayingDemo, setIsPlayingDemo] = React.useState(false);

  const toggleDemo = () => {
    setIsPlayingDemo(!isPlayingDemo);
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F0F4FF] selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background ambient glowing gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/15 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-purple-600/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

      {/* Navigation */}
      <header className="border-b border-[#1E293B]/70 bg-[#080C14]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Vocalis AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8899B4]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Audio Studio</a>
            <a href="#voices" className="hover:text-white transition-colors">Community</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <PWAInstallButton variant="button" />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Voice Cloning for Creators & Educators</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Your Voice. Everywhere. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            In Any Emotion.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#8899B4] max-w-2xl mx-auto leading-relaxed">
          Clone your voice in under 60 seconds. Generate studio-grade narration with dynamic emotion tags, instant waveforms, and multilingual expression.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30">
              Start Free Voice Cloning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/studio" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3.5 text-base border-[#1E293B] hover:bg-[#1A2235]">
              Explore Live Studio
            </Button>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8899B4]">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            60s Instant Audio Sample Cloning
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Zero Subscription Lock-In (BYO Key)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Full Progressive Web App Support
          </span>
        </div>

        {/* Studio Preview Mockup */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-[#0D1117] border border-[#1E293B] p-4 sm:p-6 shadow-2xl shadow-indigo-950/40 relative group">
          <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-500">vocalis.ai/studio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium">Model: Eleven Multilingual v2</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            <div className="lg:col-span-7 bg-[#111827] rounded-xl p-5 border border-[#1E293B]/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold">[excited]</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">[whisper]</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold">[pause]</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 font-mono leading-relaxed">
                  Welcome to Vocalis AI! <span className="text-indigo-400 font-semibold">[excited]</span> Today we are launching the next generation of voice synthesis. <span className="text-purple-400 font-semibold">[whisper]</span> Listen closely to the lifelike cadence...
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
                <span>154 / 5,000 characters</span>
                <span className="text-indigo-400 font-medium">Est. 12 seconds audio</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#111827] rounded-xl p-4 border border-[#1E293B]/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-indigo-400" />
                    Selected Voice
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Cloned (Custom)</span>
                </div>
                <p className="text-sm font-bold text-white">Alex Morgan (YouTube Host)</p>
                <p className="text-xs text-[#8899B4]">Warm, energetic, natural micro-pauses</p>
              </div>

              <div className="bg-[#111827] rounded-xl p-4 border border-[#1E293B]/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Stability</span>
                  <span className="text-indigo-400 font-mono">0.65</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[65%]" />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-300">Clarity + Similarity</span>
                  <span className="text-indigo-400 font-mono">0.85</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[85%]" />
                </div>
              </div>

              <Button
                onClick={toggleDemo}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                {isPlayingDemo ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlayingDemo ? 'Generating Speech...' : 'Sample Generation Demo'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 border-t border-[#1E293B]/80 bg-[#0A0E17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white">Built for High-Impact Voice Production</h2>
            <p className="mt-3 text-sm text-[#8899B4]">
              Everything you need to produce audiobooks, YouTube narrations, podcasts, and video ads at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#0D1117] border border-[#1E293B] hover:border-indigo-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Voice Cloning</h3>
              <p className="text-sm text-[#8899B4] leading-relaxed">
                Provide a single 60-second voice recording. Vocalis captures your subtle inflection, timbre, and accent.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1117] border border-[#1E293B] hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 mb-5">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Emotion & Pacing Tags</h3>
              <p className="text-sm text-[#8899B4] leading-relaxed">
                Insert [whisper], [excited], [sad], and pause controls directly into scripts to direct the voice actor in code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1117] border border-[#1E293B] hover:border-pink-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-600/10 flex items-center justify-center text-pink-400 mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero Markup & Private Keys</h3>
              <p className="text-sm text-[#8899B4] leading-relaxed">
                Connect your ElevenLabs API key. All credits remain on your account at raw API rates with zero middleman fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-[#1E293B] py-12 px-4 sm:px-6 lg:px-8 bg-[#080C14]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Vocalis AI</span>
            <span className="text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#8899B4]">
            <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link href="/studio" className="hover:text-white transition-colors">Studio</Link>
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
