import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="light"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-overlay': 'var(--bg-overlay)',
        'border-base': 'var(--border-base)',
        'border-hi': 'var(--border-hi)',
        'indigo': 'var(--indigo)',
        'indigo-dark': 'var(--indigo-dark)',
        'indigo-glow': 'var(--indigo-glow)',
        'violet': 'var(--violet)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
        'text-1': 'var(--text-1)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        'hind-siliguri': ['var(--font-hind-siliguri)', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
  plugins: [],
};

export default config;
