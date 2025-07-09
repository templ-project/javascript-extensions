import esConfigGlobal from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import imports from 'eslint-plugin-import';
import importNodeBuiltin from 'eslint-plugin-node-import';
import globals from 'globals';
import tsConfigGlobal from 'typescript-eslint';

/**
 * Note:
 * Do not change the order of the config keys as hey will behave differently
 */

const esConfig = getEsConfig(esConfigGlobal);
const tsConfig = getTsConfig(esConfig, tsConfigGlobal);

export default [
  {
    name: 'templ:global/node',
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...esConfig,
  },
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    ...tsConfig,
    name: 'templ:global/ts',
  },
  {
    name: 'templ:globals/tests',
    files: ['**/*.{e2e,test,spec}.{js,cjs,mjs,ts,cts,mts}'],
    ...vitest.configs.recommended,
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
];

function getEsConfig(esConfig) {
  return {
    plugins: {
      imports,
      'node-import': importNodeBuiltin,
      vitest,
    },
    rules: {
      ...esConfig.configs.recommended.rules,

      'node-import/prefer-node-protocol': 'error',

      'imports/order': [
        'error',
        {
          groups: [['builtin'], ['external'], ['internal'], ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'node:*',
              group: 'builtin',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'ignore',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    languageOptions: {
      globals: {
        ...globals.node,
        // k6 globals
        __ENV: true,
      },
    },
  };
}

function getTsConfig(esConfig, tsConfig) {
  return mergeConfigs([
    esConfig,
    ...tsConfig.configs.recommended,
    {
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        'vitest/expect-expect': 'off',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTernary: true,
          },
        ],
      },
    },
  ]);
}

function mergeConfigs(esConfArr) {
  return esConfArr.reduce(
    (a, b) => ({
      ...a,
      ...b,
      rules: {
        ...(a.rules ?? {}),
        ...(b.rules ?? {}),
      },
      plugins: {
        ...(a.plugins ?? {}),
        ...(b.plugins ?? {}),
      },
      languageOptions: {
        ...(a.languageOptions ?? {}),
        ...(b.languageOptions ?? {}),
      },
    }),
    {},
  );
}
