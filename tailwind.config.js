/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      colors: {
        // Monochromatic palette for minimalist design
        mono: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0c0c0f',
        },
        // Special dark mode colors
        dark: {
          bg: '#000000',
          card: '#0a0a0a',
          border: '#262626',
          surface: '#121212',
          input: '#171717',
        },
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'inner-light': 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'inner-dark': 'inset 0 0 0 1px rgba(0, 0, 0, 0.12)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes when using the class strategy
    }),
    function({ addBase, theme }) {
      addBase({
        // Light mode variables
        ':root': {
          '--bg-primary': theme('colors.white'),
          '--bg-secondary': theme('colors.mono.50'),
          '--bg-tertiary': theme('colors.mono.100'),
          '--text-primary': theme('colors.black'),
          '--text-secondary': theme('colors.mono.500'),
          '--border-color': theme('colors.mono.200'),
          '--input-border': theme('colors.mono.300'),
          '--input-focus': theme('colors.black'),
        },
        // Dark mode variables
        '.dark': {
          '--bg-primary': theme('colors.dark.bg'),
          '--bg-secondary': theme('colors.dark.card'),
          '--bg-tertiary': theme('colors.dark.surface'),
          '--text-primary': theme('colors.white'),
          '--text-secondary': theme('colors.mono.400'),
          '--border-color': theme('colors.dark.border'),
          '--input-border': theme('colors.mono.700'),
          '--input-focus': theme('colors.white'),
        },
      });
    },
  ],
};