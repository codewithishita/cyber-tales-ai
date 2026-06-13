import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        stone: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0c0a09',
        },
        ink: {
          DEFAULT: '#111110',
          2: '#1e1d1c',
          3: '#2a2927',
        },
        accent: {
          DEFAULT: '#1a6b4a',
          light: '#22c55e',
          glow: 'rgba(34,197,94,0.12)',
          border: 'rgba(34,197,94,0.2)',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'pulse-slow': 'pulse 3s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
        lg: '0 4px 6px rgba(0,0,0,0.05), 0 10px 40px rgba(0,0,0,0.1)',
        xl: '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
