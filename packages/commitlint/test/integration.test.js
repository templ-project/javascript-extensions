import { describe, expect, it } from 'vitest';
import commitlintConfig from '../index.mjs';

describe('commitlint configuration integration', () => {
  it('should return a valid commitlint configuration object', () => {
    const config = commitlintConfig();

    // Test that it has the required structure for commitlint
    expect(config).toBeTypeOf('object');
    expect(config.extends).toBeDefined();
    expect(Array.isArray(config.extends)).toBe(true);
    expect(config.extends).toContain('@commitlint/config-conventional');
  });

  it('should allow adding custom rules', () => {
    const customRules = {
      'header-max-length': [2, 'always', 50],
      'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
      'subject-case': [2, 'never', ['upper-case']],
      'subject-empty': [2, 'never'],
      'subject-full-stop': [2, 'never', '.'],
    };

    const config = commitlintConfig({ rules: customRules });

    expect(config.rules).toEqual(customRules);
    expect(config.extends).toContain('@commitlint/config-conventional');
  });

  it('should allow custom parser preset configuration', () => {
    const customConfig = {
      parserPreset: {
        name: 'conventional-changelog-conventionalcommits',
        parserOpts: {
          headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject'],
        },
      },
    };

    const config = commitlintConfig(customConfig);

    expect(config.parserPreset).toEqual(customConfig.parserPreset);
    expect(config.extends).toContain('@commitlint/config-conventional');
  });

  it('should allow ignores configuration', () => {
    const customConfig = {
      ignores: [(commit) => commit.includes('WIP'), (commit) => commit.includes('[skip ci]')],
      defaultIgnores: false,
    };

    const config = commitlintConfig(customConfig);

    expect(config.ignores).toEqual(customConfig.ignores);
    expect(config.defaultIgnores).toBe(false);
    expect(config.extends).toContain('@commitlint/config-conventional');
  });

  it('should maintain configuration integrity with complex options', () => {
    const complexConfig = {
      extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
      rules: {
        'header-max-length': [2, 'always', 100],
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
      },
      parserPreset: 'conventional-changelog-conventionalcommits',
      formatter: '@commitlint/format',
      defaultIgnores: true,
      helpUrl: 'https://commitlint.js.org/#/reference-rules',
    };

    const config = commitlintConfig(complexConfig);

    // Verify all properties are preserved
    expect(config.extends).toEqual(['@commitlint/config-conventional', '@commitlint/config-lerna-scopes']);
    expect(config.rules).toEqual(complexConfig.rules);
    expect(config.parserPreset).toBe(complexConfig.parserPreset);
    expect(config.formatter).toBe(complexConfig.formatter);
    expect(config.defaultIgnores).toBe(complexConfig.defaultIgnores);
    expect(config.helpUrl).toBe(complexConfig.helpUrl);
  });

  it('should handle plugin configuration', () => {
    const configWithPlugins = {
      plugins: ['commitlint-plugin-function-rules'],
      rules: {
        'function-rules/function-rule': [2, 'always'],
      },
    };

    const config = commitlintConfig(configWithPlugins);

    expect(config.plugins).toEqual(configWithPlugins.plugins);
    expect(config.rules).toEqual(configWithPlugins.rules);
    expect(config.extends).toContain('@commitlint/config-conventional');
  });

  it('should preserve function references in configuration', () => {
    const testFunction = (commit) => commit.includes('test');
    const configWithFunctions = {
      ignores: [testFunction],
      rules: {
        'custom-rule': [2, 'always'],
      },
    };

    const config = commitlintConfig(configWithFunctions);

    expect(config.ignores).toContain(testFunction);
    expect(config.ignores[0]).toBe(testFunction);
    expect(typeof config.ignores[0]).toBe('function');
  });
});
