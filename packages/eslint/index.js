import jsAndTsConfig from './rules/js-and-ts.js';
import jsonConfig from './rules/json.js';
import markdownConfig from './rules/markdown.js';
import prettierConfig from './rules/prettier.js';
import textConfig from './rules/text.js';
import yamlConfig from './rules/yaml.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/venv/**/*.*', '**/vitest.config.js', 'tmp.*', '**/tmp', '*.tmp'] },
  ...jsAndTsConfig,
  ...prettierConfig,
  ...yamlConfig,
  ...jsonConfig,
  ...textConfig,
  ...markdownConfig,
];
