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
        bg:       '#07070c',
        surface:  '#0e0e18',
        surface2: '#14141f',
        surface3: '#1a1a28',
        border:   '#1e1e30',
        accent:   '#ff6b2b',
        accent2:  '#ffd60a',
        muted:    '#4e4e66',
        danger:   '#ff4466',
        success:  '#00e5a0',
      },
    },
  },
  plugins: [],
}
