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
        bg:       'rgb(var(--color-bg) / <alpha-value>)',
        surface:  'rgb(var(--color-surface) / <alpha-value>)',
        surface2: 'rgb(var(--color-surface2) / <alpha-value>)',
        surface3: 'rgb(var(--color-surface3) / <alpha-value>)',
        border:   'rgb(var(--color-border) / <alpha-value>)',
        accent:   'rgb(var(--color-accent) / <alpha-value>)',
        accent2:  'rgb(var(--color-accent2) / <alpha-value>)',
        muted:    'rgb(var(--color-muted) / <alpha-value>)',
        danger:   'rgb(var(--color-danger) / <alpha-value>)',
        success:  'rgb(var(--color-success) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
