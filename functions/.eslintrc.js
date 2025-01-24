module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: ["tsconfig.json"],
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/node_modules/**/*",
  ],
  rules: {
    // Disable all stylistic complaints
    "semi": "off",
    "quotes": "off",
    "max-len": "off",
    "indent": "off",
    "object-curly-spacing": "off",
    "eol-last": "off",

    // Relax type rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-non-null-assertion": "off",

    // Keep only essential checks
    "no-console": "off",
    "no-debugger": "warn",
  },
};
