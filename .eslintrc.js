module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "standard", "plugin:prettier/recommended", "plugin:valtio/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "valtio/state-snapshot-rule": "warn",
    "valtio/avoid-this-in-proxy": "warn",
  },
};
