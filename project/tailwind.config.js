/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        accent: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        chat: {
          bg: '#0f1419',
          sidebar: '#17212b',
          window: '#0e1621',
          divider: '#1f2937',
          hover: '#1f2937',
          bubble: {
            own: '#2b5278',
            other: '#182533',
          },
          input: '#1f2937',
        },
        text: {
          primary: '#e4e6eb',
          secondary: '#8b95a1',
          muted: '#6b7280',
          link: '#64b5f6',
        },
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.0625rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        100: '25rem',
        112: '28rem',
        128: '32rem',
      },
      borderRadius: {
        'bubble': '1.125rem',
        'card': '0.75rem',
      },
      boxShadow: {
        'chat': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'sidebar': '2px 0 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
