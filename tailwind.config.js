/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        desk: '880px',
      },
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        text: 'var(--text)',
        'text-dim': 'var(--text-dim)',
        'text-mute': 'var(--text-mute)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'accent-tint': 'var(--accent-tint)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      keyframes: {
        rise: {
          from: { transform: 'translateY(28px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'sheet-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-left': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'toast-in': {
          from: { transform: 'translate(-50%, -10px)', opacity: '0' },
          to: { transform: 'translate(-50%, 0)', opacity: '1' },
        },
      },
      animation: {
        rise: 'rise 0.32s cubic-bezier(0.2,0.8,0.2,1)',
        'fade-in': 'fade-in 0.2s ease',
        'sheet-up': 'sheet-up 0.32s cubic-bezier(0.2,0.8,0.2,1)',
        'slide-left': 'slide-left 0.32s cubic-bezier(0.2,0.8,0.2,1)',
        'toast-in': 'toast-in 0.2s ease',
      },
    },
  },
  plugins: [],
};
