# Vocalis AI (AuraVoice)

Production-ready SaaS web application for AI-powered voice cloning and content generation using Next.js App Router, Supabase SSR, and ElevenLabs.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system variables (Dark & Light themes)
- **Authentication & Database**: Supabase (`@supabase/ssr`, PostgreSQL, Row-Level Security)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Voice Engine**: ElevenLabs Neural Voice Cloning & Synthesis
- **Audio Capture**: Web Audio API with real-time RMS metering

## Features Built

- **Push 1: Foundation, Authentication & App Shell**
  - Ambient glowing multi-gradient auth pages (Desktop & Mobile optimized)
  - Supabase SSR authentication (Email/Password & Google OAuth)
  - Middleware route protection for `/studio`, `/voice-studio`, `/library`, etc.
  - Sidebar, TopBar, and Mobile Navigation bar with dark/light theme toggle
  - Database schema with RLS policies in `supabase/schema.sql`
- **Push 2: Voice Cloning Studio**
  - Statutory Consent Gate with customized verification checks
  - Dual-language prompt script (English & Bengali with Hind Siliguri font)
  - Real-time 12-bar frequency volume meter
  - Concentric pulsing mic button with 30s minimum recording threshold
  - Real-time upload progress with XMLHttpRequest
  - Success verification and Voice Card management (audio preview, public/private toggle, re-clone, delete)

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
ELEVENLABS_API_KEY="your-elevenlabs-api-key"
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
