module.exports = {
  purge: {
    content: ["./src/**/*.{svelte,js,ts,html}"],
  },

  darkMode: "class",

  theme: {
    screens: {
      sm: "600px",
      md: "875px",
      lg: "1440px",
      xl: "1980px",
    },

    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        lg: "2rem",
      },
    },

    fontSize: {
      sm: ["14px", "20px"],
      base: ["16px", "24px"],
      lg: ["20px", "28px"],
      xl: ["24px", "32px"],
    },
  },

  mode: "jit",
};
