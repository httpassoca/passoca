module.exports = {
  purge: {
    content: [
      'components/**/*.{vue,js}',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'nuxt.config.{js,ts}'
    ]
  },
  darkMode: 'class',
  theme: {
    darkSelector: '.dark-mode',
    colors: {
      accent: '#66ef73',
      background: '#FBF5F1',
      darkBackground: '#100f10',
      darkText: '#e0e0e0',
      gray: '#b1b1b1',
      darkGray: '#272727'
    },
    screens: {
      sm: '475px',
      md: '1024px',
      lg: '1440px',
      xl: '1980px'
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '2rem'
      }
    }
  },
  variants: {
    backgroundColor: [
      'dark',
      'dark-hover',
      'dark-group-hover',
      'dark-even',
      'dark-odd'
    ],
    borderColor: ['dark', 'dark-focus', 'dark-focus-within'],
    textColor: ['dark', 'dark-hover', 'dark-active']
  },
  plugins: [require('tailwindcss-dark-mode')()]
}
