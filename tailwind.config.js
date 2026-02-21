/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vida: {
          primary: '#B99CFF',
          'primary-dim': '#9B7EFF',
          'primary-glow': '#C8B0FF',
          superb: '#7AFF71',
          good: '#1CBE72',
          fair: '#F9F37E',
          poor: '#FF9767',
          dark: {
            bg: '#0F0D1A',
            surface: '#1A1728',
            card: '#211E32',
            border: '#2D2A42',
            'border-light': '#3D3960',
          },
          light: {
            bg: '#F7F3FF',
            surface: '#FFFFFF',
            card: '#FAF7FF',
            border: '#E5DFF5',
            'border-dark': '#C5B8F0',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
