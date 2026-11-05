import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.ts'],
  theme: {
    extend: {
      colors: {
        garden: {
          50: '#f2f9f0',
          100: '#e0f0da',
          200: '#c2e2b6',
          300: '#96cc85',
          400: '#66b154',
          500: '#45953a',
          600: '#33752d',
          700: '#2a5d26',
          800: '#254b22',
          900: '#1f3d1e',
        },
        brass: {
          100: '#faf0d7',
          200: '#f3dfae',
          300: '#eac67e',
          400: '#e0a952',
          500: '#d18a34',
          600: '#b56d28',
          700: '#8f5424',
          800: '#754625',
          900: '#624022',
        },
        pond: {
          100: '#dff3fa',
          200: '#bfe7f4',
          300: '#93d5ec',
          400: '#5fbce0',
          500: '#3a9fcb',
          600: '#2c84ad',
          700: '#276a8c',
          800: '#245873',
          900: '#224a61',
        },
        fox: {
          DEFAULT: '#b4552d',
          deep: '#7c3a1d',
          cream: '#f7e8d5',
        },
        turtle: {
          DEFAULT: '#3f7d4e',
          deep: '#2a5a36',
          cream: '#eef3e2',
        },
        ink: '#22301f',
        parchment: '#faf6ec',
      },
      fontFamily: {
        story: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        ui: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
