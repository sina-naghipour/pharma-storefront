/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // New primary: deep teal
        primary: {
          50: '#e6f2f1',
          100: '#b3d9d6',
          200: '#80bfbc',
          300: '#4da6a1',
          400: '#268c87',
          500: '#0F5B5C',
          600: '#0c494a',
          700: '#093737',
          800: '#062525',
          900: '#031212',
        },
        // New accent: warm amber
        accent: {
          500: '#F59E0B',
          600: '#c47e09',
        },
        // Soft background (light mode)
        cream: '#F9FAFB',
        // Dark mode custom colors (from original project)
        dark: {
          bg: '#1a1a2e',
          surface: '#16213e',
          text: '#e2e8f0',
          border: '#2d3748',
        },
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
        'hover': '0 12px 24px -8px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}