/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0a1929',
        'neon-red': '#f71e4c',
        primary: {
          DEFAULT: '#f71e4c',
          light: '#ff4e75',
          dark: '#d30d36',
        },
        accent: '#FF3366',
        success: '#00C853',
        warning: '#FFB300',
        error: '#FF3D00',
        dark: {
          DEFAULT: '#121212',
          surface: '#1E1E1E',
          card: '#242424',
          border: '#333333',
        },
        light: {
          DEFAULT: '#F5F7FA',
          surface: '#FFFFFF',
          card: '#F0F2F5',
          border: '#E1E4E8',
        },
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'inner-light': 'inset 0 1px 4px rgba(0, 0, 0, 0.05)',
        'inner-dark': 'inset 0 1px 4px rgba(0, 0, 0, 0.3)',
        'neon': '0 0 20px rgba(247, 30, 76, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'float': 'float 8s ease-in-out infinite',
        'pulse-neon': 'pulseNeon 3s infinite',
        'pulse-strong-neon': 'pulseStrongNeon 2.5s infinite',
        'slide-in-right': 'slideIn 0.3s ease forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
        },
        pulseStrongNeon: {
          '0%, 100%': { 
            opacity: '0.4', 
            filter: 'brightness(0.8)',
            boxShadow: '0 0 8px rgba(247, 30, 76, 0.6)'
          },
          '50%': { 
            opacity: '1', 
            filter: 'brightness(1.3)',
            boxShadow: '0 0 25px rgba(247, 30, 76, 0.9), 0 0 40px rgba(247, 30, 76, 0.6)'
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 