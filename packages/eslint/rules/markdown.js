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
    },
  },
]);
