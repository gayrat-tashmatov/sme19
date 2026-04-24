/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A3D',
          700: '#2A3F58',
          600: '#3A5173',
          50: '#F2F5F8',
        },
        gold: {
          DEFAULT: '#8B6F3A',
          light: '#B08D4C',
          dark: '#6E5829',
          soft: '#F5EFE3',
        },
        ink: {
          DEFAULT: '#1B2A3D',
          muted: '#5A6575',
          line: '#E5E7EB',
        },
        success: '#4CAF50',
        danger: '#E57373',
        secondary: '#5B8DB8',
        bg: {
          DEFAULT: '#F7F8FA',
          white: '#FFFFFF',
          band: '#EFF1F4',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['var(--font-inter)', 'Calibri', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(27,42,61,0.04)',
        card: '0 1px 3px rgba(27,42,61,0.06), 0 1px 2px rgba(27,42,61,0.04)',
        'card-hover': '0 10px 24px -6px rgba(27,42,61,0.10), 0 4px 8px rgba(27,42,61,0.04)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #1B2A3D 0%, #2A3F58 55%, #1B2A3D 100%)',
        'gold-gradient': 'linear-gradient(135deg, #8B6F3A 0%, #B08D4C 100%)',
        'hero-overlay':
          'radial-gradient(ellipse at 20% 0%, rgba(176,141,76,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(91,141,184,0.10) 0%, transparent 50%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
      borderRadius: {
        xl2: '14px',
      },
    },
  },
  plugins: [],
};
