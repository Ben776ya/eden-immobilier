import type { Config } from 'tailwindcss'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindcssMotion = require('tailwindcss-motion')

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
          // Dark surfaces (header, footer, hero overlay, CTA sections)
          ink:          '#1C1917',
          // Light surfaces (page body, content sections)
          surface:      '#FAFAF8',
          card:         '#F5F3EF',
          // Gold accent family
          gold:         '#C5A47E',   // decorative: borders, dividers, icons (2.24:1 on light — NOT for text)
          'gold-deep':  '#A8865C',   // hover states on gold UI elements
          'gold-light': '#E8D5B7',   // subtle tints, hairlines on dark sections
          // Text hierarchy for light sections
          text:         '#1C1917',   // primary text on light (16.73:1 on surface)
          'text-muted': '#716A65',   // secondary text on light (4.80:1 on card — WCAG AA)
          // Text for dark sections
          white:        '#FFFFFF',   // primary text on dark (17.49:1 on ink)
          // Borders
          border:       '#E7E0D8',   // default border on light surfaces
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label:  '0.35em',
        luxury: '0.25em',
        wide:   '0.08em',
      },
      boxShadow: {
        luxury:        '0 4px 24px -2px rgba(28, 25, 23, 0.08)',
        'luxury-hover':'0 8px 40px -4px rgba(28, 25, 23, 0.14)',
      },
    },
  },
  plugins: [tailwindcssMotion],
}
export default config
