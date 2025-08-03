// eslint.config.mjs
import templEslintConfig from './packages/eslint/index.js';

export default [
  {
    ignores: ['packages/*/dist/**', 'apps/*/build/**'],
  },
  ...templEslintConfig,
  {
    files: ['packages/shared/**'],
    rules: {
      // Stricter rules for shared packages
      'no-console': 'error',
    },
  },
];
