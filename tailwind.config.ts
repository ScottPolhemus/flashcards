import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { heroui } from '@heroui/react'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // colors: {
      //   background: 'var(--background)',
      //   foreground: 'var(--foreground)',
      // },
    },
  },
  plugins: [
    heroui({
      layout: {
        fontSize: {
          medium: '18px',
        },
      },
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.backface-visible': {
          'backface-visibility': 'visible',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.transform-3d': {
          'transform-style': 'preserve-3d',
        },
      })
    }),
  ],
} satisfies Config
