/** @type {import('tailwindcss').Config} */
// Colours are CSS variables (see src/styles.css) so light/dark is one token swap.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./*.html', './src/**/*.js'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: v('paper'),
        surface: v('surface'),
        sunken: v('sunken'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        primary: v('primary'),
        'primary-fg': v('primary-fg'),
        accent: v('accent'),
        chrome: v('chrome'),
        'chrome-fg': v('chrome-fg'),
        settled: v('settled'),
        rejected: v('rejected'),
        pending: v('pending'),
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
      },
      fontSize: {
        // 1.2 modular scale anchored at 15px body
        xs: ['0.75rem', '1.1rem'],
        sm: ['0.8125rem', '1.25rem'],
        base: ['0.9375rem', '1.5rem'],
        lg: ['1.125rem', '1.6rem'],
        xl: ['1.35rem', '1.8rem'],
        '2xl': ['1.62rem', '2rem'],
        '3xl': ['1.94rem', '2.3rem'],
        '4xl': ['2.33rem', '2.6rem'],
        '5xl': ['2.8rem', '3rem'],
      },
      borderRadius: { DEFAULT: '8px', lg: '12px', xl: '14px', '2xl': '20px' },
      maxWidth: { prose: '68ch' },
    },
  },
  plugins: [],
};
