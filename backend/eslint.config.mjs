// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config} */
export default {
  files: ["**/*.{js,mjs,cjs,ts}"], // Aseguramos que cubra los archivos relevantes
  languageOptions: {
    globals: globals.browser, // Variables globales del navegador
    parser: tsParser, // Usamos el parser de TypeScript
    ecmaVersion: "latest", // Usamos la última versión de ECMAScript
    sourceType: "module", // Asegura que soporte módulos ES
  },
  plugins: {
    "@typescript-eslint": tsPlugin, // Plugin de ESLint para TypeScript
  },
  rules: {
    ...js.configs.recommended.rules, // Reglas recomendadas para JS
    ...tsPlugin.configs.recommended.rules, // Reglas recomendadas para TypeScript
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Evita variables no utilizadas en TypeScript
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  ignores: ["node_modules", "dist"], // Ignoramos node_modules y dist
};

// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";

// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {
//     files: ["**/*.{js,mjs,cjs,ts}"], // Aseguramos que cubra los archivos relevantes
//     languageOptions: { globals: globals.browser }, // Variables globales del navegador
//     ...pluginJs.configs.recommended, // Reglas recomendadas para JS
//     ...tseslint.configs.recommended, // Reglas recomendadas para TypeScript
//   }, {
//     ignores: ["node_modules", "dist"]
//   }
// ];
