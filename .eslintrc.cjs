module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // This project has legacy patterns; keep lint helpful but non-blocking.
    "@typescript-eslint/no-explicit-any": "off",
    "prefer-const": "off",
    "@typescript-eslint/no-unused-vars": "off",

    // Svelte-specific rules: allow existing usage.
    "svelte/no-at-html-tags": "off",
    "svelte/valid-compile": "off",
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: 2022,
        sourceType: "module",
        extraFileExtensions: [".svelte"],
      },
      rules: {
        // Keep Svelte a11y warnings out of CI for now.
        "svelte/valid-compile": "off",
      },
    },
  ],
};
