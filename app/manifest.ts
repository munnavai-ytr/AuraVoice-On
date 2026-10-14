import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Vocalis AI',
    short_name: 'Vocalis',
    description: 'AI Voice Cloning Studio for Creators — Clone your voice and generate speech in seconds.',
    start_url: '/studio',
    scope: '/',
    display: 'standalone',
    background_color: '#080C14',
    theme_color: '#6366F1',
    orientation: 'portrait-primary',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Open Studio',
        url: '/studio',
        description: 'Generate realistic AI voiceovers',
      },
      {
        name: 'Voice Cloner',
        url: '/voice-studio',
        description: 'Clone a new custom voice',
      },
      {
        name: 'My Library',
        url: '/library',
        description: 'Browse generated audio files',
      },
    ],
  };
}
