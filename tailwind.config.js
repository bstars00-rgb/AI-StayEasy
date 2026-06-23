/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — confident travel-emerald. Trust without the OTA red/blue.
        brand: {
          50: '#ecfdf5',
          100: '#cdf9e4',
          200: '#9bf0cd',
          300: '#5fe1b0',
          400: '#2ecb93',
          500: '#10b67d',
          600: '#069467',
          700: '#077655',
          800: '#0a5d45',
          900: '#0a4d3a',
        },
        // Accent — sunset coral. Energy & warmth for a 20–40 travel audience.
        accent: {
          50: '#fff5f0',
          100: '#ffe6da',
          200: '#ffc7b0',
          300: '#ffa17d',
          400: '#ff7a4d',
          500: '#fb5d2c',
          600: '#e8451a',
          700: '#c03715',
          800: '#992f18',
          900: '#7d2b1a',
        },
        // Warm paper neutrals for backgrounds.
        sand: {
          50: '#faf8f3',
          100: '#f3eee2',
          200: '#e8dcc5',
          300: '#dac79b',
        },
        // Cool ink neutrals for text.
        ink: {
          600: '#4a5468',
          700: '#374152',
          800: '#1f2937',
          900: '#0f172a',
        },
      },
      fontFamily: {
        // Pretendard everywhere — one modern face that renders Korean, Latin and
        // numbers consistently (the de-facto Korean web standard). Headings and
        // body share it for a clean, unified look.
        display: ['"Pretendard Variable"', 'Pretendard', 'system-ui', '"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
        sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', '-apple-system', '"Segoe UI"', '"Apple SD Gothic Neo"', '"Noto Sans KR"', '"Malgun Gothic"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 10px 30px rgba(15, 23, 42, 0.07)',
        'card-hover': '0 6px 16px rgba(15, 23, 42, 0.12), 0 22px 48px rgba(15, 23, 42, 0.12)',
        glow: '0 8px 30px rgba(16, 182, 125, 0.28)',
        'glow-accent': '0 8px 30px rgba(251, 93, 44, 0.28)',
      },
      borderRadius: {
        '4xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
