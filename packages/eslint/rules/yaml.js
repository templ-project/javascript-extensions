import yaml from 'eslint-plugin-yml';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...yaml.configs['flat/recommended'],
  {
    name: 'templ:yml/overrides',
    files: ['*.yaml', '**/*.yaml', '*.yml', '**/*.yml'],
    rules: {
      indent: ['error', 2],
      'yml/quotes': ['error', { prefer: 'single', avoidEscape: true }],
      'yml/no-empty-document': 'error',
    },
  },
];
