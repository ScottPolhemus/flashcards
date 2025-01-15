import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { nextui } from '@nextui-org/react'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
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
    nextui(),
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
