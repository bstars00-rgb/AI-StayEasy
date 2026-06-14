/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // StayEasy brand — warm, trustworthy, travel-friendly (not OTA red/blue)
        brand: {
          50: '#eefdf6',
          100: '#d6f9e8',
          200: '#aff1d3',
          300: '#79e4b8',
          400: '#3fcf98',
          500: '#16b67d',
          600: '#0a9466',
          700: '#0a7654',
          800: '#0c5d44',
          900: '#0b4d3a',
        },
        sand: {
          50: '#fbf8f1',
          100: '#f5eede',
          200: '#ebdcbd',
          300: '#dec293',
        },
        ink: {
          700: '#33415c',
          800: '#1f2937',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 8px 24px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 4px 12px rgba(15, 23, 42, 0.12), 0 16px 40px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
}
