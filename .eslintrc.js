module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "error",
    "no-unused-vars": "warn",
  },
  ignorePatterns: ["node_modules/", ".next/", "out/"],
};