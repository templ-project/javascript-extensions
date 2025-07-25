import markdown from 'eslint-plugin-markdown';

/** @type {const('eslint').Linter.Config[]} */
export default markdown.configs.recommended.concat([
  {
    name: 'templ:markdown/code-blocks/js',
    files: ['**/*.md/*.js'],
    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'require-await': 'off',
      'no-unreachable': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },
  {
    name: 'templ:markdown/code-blocks/ts',
    files: ['**/*.md/*.ts'],
    rules: {
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'require-await': 'off',
      'no-unreachable': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
    },
  },
  {
    name: 'templ:markdown/code-blocks/json',
    files: ['**/*.md/*.json'],
    rules: {
      'no-dupe-keys': 'off',
    },
  },
]);
