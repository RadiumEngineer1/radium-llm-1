/** @type {import('tailwindcss').Config} */

// Tailwind v3 color with CSS variable + alpha support
const c = (name) => `rgb(var(${name}) / <alpha-value>)`

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
        bg:       c('--color-bg'),
        surface:  c('--color-surface'),
        surface2: c('--color-surface2'),
        surface3: c('--color-surface3'),
        border:   c('--color-border'),
        accent:   c('--color-accent'),
        accent2:  c('--color-accent2'),
        muted:    c('--color-muted'),
        danger:   c('--color-danger'),
        success:  c('--color-success'),
      },
    },
  },
  plugins: [],
}
