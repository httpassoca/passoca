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
      primary: '#66ef73',
      backcolor: '#FBF5F1',
      darkColor: '#100f10',
      darkText: '#e0e0e0'
    },
    screens: {
      sm: '475px',
      md: '1024px',
      lg: '1440px',
      xl: '1980px'
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
