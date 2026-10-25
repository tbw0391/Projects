import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1e3a8a',
        navyDark: '#172554',
        brand: '#dc2626',
      },
    },
  },
  plugins: [],
};

export default config;
