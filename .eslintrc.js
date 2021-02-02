// .babelrc.js

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
    parser: '@typescript-eslint/parser',
      extends: ["eslint:recommended","plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {"consistent-return":2,"no-else-return":1,"space-unary-ops":2,"indent":[1,2],"semi":[1,"always"]},
}
