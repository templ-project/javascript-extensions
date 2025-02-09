import json from '@eslint/json';
import jsonc from 'eslint-plugin-jsonc';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      json,
      jsonc,
    },
  },
  {
    name: 'templ:json/ignores',
    ignores: [
      'package-lock.json',
      '**/package-lock.json',
      '.nyc_output',
      '**/.nyc_output',
      '**/coverage',
      'coverage',
      '**/dist',
    ],
  },
  {
    name: 'templ:json/overrides',
    files: ['*.json', '**/*.json'],
    language: 'json/json',
    rules: {
      'no-irregular-whitespace': 'off', // Disable the problematic rule
    },
  },
  {
    name: 'templ:jsonc/overrides',
    files: [
      '*.jsonc',
      '**/*.jsonc',
      '**/tsconfig*.json', //
    ],
    language: 'json/jsonc',
    rules: {
      'no-irregular-whitespace': 'off', // Disable the problematic rule
    },
  },
  {
    name: 'templ:json5/overrides',
    files: ['*.json5', '**/*.json5'],
    language: 'json/json5',
    rules: {
      'no-irregular-whitespace': 'off', // Disable the problematic rule
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
];
