/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        danger: 'var(--color-danger)',
        neutral: 'var(--color-neutral)',
        board: 'var(--color-board-bg)',
        panel: 'var(--color-panel-bg)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
      },
      boxShadow: {
        glow: '0 0 12px rgba(255,255,255,0.35)',
      },
      keyframes: {
        'line-pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0.4' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'line-pop': 'line-pop 220ms ease-out',
        pulse: 'pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

