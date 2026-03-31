/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui:   ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg:       'var(--hex-bg)',
        surface:  'var(--hex-surface)',
        surface2: 'var(--hex-surface2)',
        surface3: 'var(--hex-surface3)',
        border:   'var(--hex-border)',
        accent:   'var(--hex-accent)',
        accent2:  'var(--hex-accent2)',
        muted:    'var(--hex-muted)',
        danger:   'var(--hex-danger)',
        success:  'var(--hex-success)',
      },
    },
  },
  plugins: [],
}
