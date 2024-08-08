module.exports = {
  root: true,
  plugins: ["@dvcol/presets"],
  extends: [
    "plugin:@dvcol/presets/typescript",
    "plugin:@dvcol/presets/prettier",
  ],
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        packageDir: __dirname,
      },
    ],
  },
  overrides: [
    {
      files: ["*.json", "*.json5"],
      parser: "jsonc-eslint-parser",
      rules: {
        "@typescript-eslint/consistent-type-imports": "off",
      },
    },
  ],
};
