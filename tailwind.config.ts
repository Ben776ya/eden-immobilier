import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        eden: {
          bg: '#0F0D0D',
          surface: '#1A1210',
          burgundy: '#7B1D1D',
          gold: '#C9A84C',
          'gold-light': '#D4B86A',
          cream: '#F5F0E8',
          muted: '#9E9289',
          border: '#2E2723',
          'border-light': '#3D332C',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.35em',
      },
    },
  },
  plugins: [],
}
export default config
