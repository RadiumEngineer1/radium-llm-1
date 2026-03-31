/** @type {import('tailwindcss').Config} */

function withOpacity(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${varName}), ${opacityValue})`
    }
    return `rgb(var(${varName}))`
  }
}

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
        bg:       withOpacity('--color-bg'),
        surface:  withOpacity('--color-surface'),
        surface2: withOpacity('--color-surface2'),
        surface3: withOpacity('--color-surface3'),
        border:   withOpacity('--color-border'),
        accent:   withOpacity('--color-accent'),
        accent2:  withOpacity('--color-accent2'),
        muted:    withOpacity('--color-muted'),
        danger:   withOpacity('--color-danger'),
        success:  withOpacity('--color-success'),
      },
    },
  },
  plugins: [],
}
