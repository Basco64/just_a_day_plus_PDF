module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["@next/next"], 
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "error",
  },
  ignorePatterns: ["node_modules/", ".next/", "out/"],
};