import type { Config } from 'tailwindcss'
import { colors } from './tailwind.colors'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    colors,
    extend: {
      fontFamily: {
        main: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
