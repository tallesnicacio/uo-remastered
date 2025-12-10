import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "ServUO/**"]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off"
    }
  },
  {
    files: ["client/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module", ecmaVersion: "latest" },
      globals: {
        ...globals.browser
      }
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {}
  },
  {
    files: ["server/**/*.ts", "shared/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: "module", ecmaVersion: "latest" },
      globals: {
        ...globals.node,
        Bun: "readonly",
        WebSocket: "readonly",
        Response: "readonly",
        performance: "readonly"
      }
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {}
  }
];
