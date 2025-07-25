import { describe, expect, it } from 'vitest';
import commitlintConfig from '../index.mjs';

describe('commitlint configuration examples', () => {
  it('should create a basic configuration for standard projects', () => {
    const config = commitlintConfig();

    expect(config).toMatchSnapshot();
  });

  it('should create a custom configuration for strict projects', () => {
    const strictConfig = commitlintConfig({
      rules: {
        'header-max-length': [2, 'always', 50],
        'body-max-line-length': [2, 'always', 72],
        'footer-max-line-length': [2, 'always', 72],
        'type-enum': [
          2,
          'always',
          ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
        ],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [2, 'always'],
      },
    });

    expect(strictConfig.extends).toContain('@commitlint/config-conventional');
    expect(strictConfig.rules['header-max-length']).toEqual([2, 'always', 50]);
    expect(strictConfig.rules['type-enum'][2]).toContain('feat');
    expect(strictConfig.rules['type-enum'][2]).toContain('fix');
  });

  it('should create a configuration with custom ignores for automated commits', () => {
    const configWithIgnores = commitlintConfig({
      ignores: [
        (commit) => commit.includes('[skip ci]'),
        (commit) => commit.includes('WIP:'),
        (commit) => commit.includes('Merge branch'),
        (commit) => commit.startsWith('Revert '),
        (commit) => /^v\d+\.\d+\.\d+/.test(commit), // Version tags
      ],
      defaultIgnores: false,
    });

    expect(configWithIgnores.ignores).toHaveLength(5);
    expect(configWithIgnores.defaultIgnores).toBe(false);

    // Test that the ignore functions work as expected
    const skipCiCommit = 'feat: add feature [skip ci]';
    const wipCommit = 'WIP: working on feature';
    const mergeCommit = 'Merge branch feature/test';
    const revertCommit = 'Revert "bad commit"';
    const versionCommit = 'v1.2.3';

    expect(configWithIgnores.ignores[0](skipCiCommit)).toBe(true);
    expect(configWithIgnores.ignores[1](wipCommit)).toBe(true);
    expect(configWithIgnores.ignores[2](mergeCommit)).toBe(true);
    expect(configWithIgnores.ignores[3](revertCommit)).toBe(true);
    expect(configWithIgnores.ignores[4](versionCommit)).toBe(true);

    // Regular commits should not be ignored
    const regularCommit = 'feat: add new feature';
    expect(configWithIgnores.ignores[0](regularCommit)).toBe(false);
  });

  it('should create a monorepo-friendly configuration', () => {
    const monorepoConfig = commitlintConfig({
      extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
      rules: {
        'scope-enum': [2, 'always', ['core', 'api', 'ui', 'docs', 'tests', 'build', 'deps', 'config']],
        'scope-empty': [2, 'never'],
      },
    });

    expect(monorepoConfig.extends).toContain('@commitlint/config-conventional');
    expect(monorepoConfig.extends).toContain('@commitlint/config-lerna-scopes');
    expect(monorepoConfig.rules['scope-enum'][2]).toContain('core');
    expect(monorepoConfig.rules['scope-empty']).toEqual([2, 'never']);
  });
});
