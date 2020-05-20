// .eslintrc.js

module.exports = {
  plugins: ['mocha'],
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ['eslint:recommended', 'plugin:mocha/recommended'],
  parserOptions: {
    parser: require.resolve('babel-eslint'),
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  root: true,
  rules: {
    'consistent-return': 2,
    indent: [1, 4],
    'no-else-return': 1,
    semi: [1, 'always'],
    'space-unary-ops': 2,
  },
};
