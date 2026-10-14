-- Vocalis AI Database Schema
-- Run this script in the Supabase SQL Editor to provision tables, security rules, and triggers.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  user_voice_id TEXT,           -- ElevenLabs voice_id
  custom_api_key TEXT,          -- Encrypted EL API key
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Voice Templates Table
CREATE TABLE IF NOT EXISTS voice_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voice_name TEXT NOT NULL,
  elevenlabs_voice_id TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  category TEXT,                -- 'youtube','tiktok','ads','story','education'
  preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Generated Audios Table
CREATE TABLE IF NOT EXISTS generated_audios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voice_id TEXT NOT NULL,
  title TEXT NOT NULL,
  script_text TEXT,
  audio_url TEXT,
  duration_seconds INTEGER,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_audios ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DO $$ BEGIN
  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Voice templates policies
DO $$ BEGIN
  CREATE POLICY "Users can manage own voices"
    ON voice_templates FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public voices visible to all"
    ON voice_templates FOR SELECT USING (is_public = TRUE);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Generated audios policies
DO $$ BEGIN
  CREATE POLICY "Users can manage own audios"
    ON generated_audios FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
