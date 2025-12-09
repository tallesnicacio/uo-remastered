module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022
  },
  ignorePatterns: ["dist/", "ServUO/"],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "off"
  }
};
