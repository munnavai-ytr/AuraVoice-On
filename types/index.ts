export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  user_voice_id: string | null;
  custom_api_key: string | null;
  onboarding_complete: boolean;
  created_at: string;
}

export interface VoiceTemplate {
  id: string;
  user_id: string;
  voice_name: string;
  elevenlabs_voice_id: string;
  is_public: boolean;
  category: string | null;
  preview_url: string | null;
  created_at: string;
}

export interface GeneratedAudio {
  id: string;
  user_id: string;
  voice_id: string;
  title: string;
  script_text: string | null;
  audio_url: string | null;
  duration_seconds: number | null;
  category: string | null;
  created_at: string;
}

export type KeyTier = 'free' | 'starter' | 'creator' | 'pro' | 'scale' | 'enterprise';

export interface ELKeyInfo {
  tier: KeyTier;
  characterLimit: number;
  charactersUsed: number;
  isFreeTier: boolean;
  canShareCommunity: boolean;
  maxScriptLength: number;
  renewalDate: number | null;
}
