import type { Linter } from 'eslint';

/**
 * Configuration options for the ESLint factory function
 */
export interface EslintConfigOptions {
  /** Enable TypeScript and JavaScript rules (default: true) */
  enableTypeScript?: boolean;

  /** Enable Prettier integration rules (default: true) */
  enablePrettier?: boolean;

  /** Enable YAML file linting (default: true) */
  enableYaml?: boolean;

  /** Enable JSON file linting (default: true) */
  enableJson?: boolean;

  /** Enable Markdown file linting (default: true) */
  enableMarkdown?: boolean;

  /** Enable text file linting (default: true) */
  enableText?: boolean;

  /** Enable Vitest testing rules (default: true) */
  enableVitest?: boolean;

  /** Custom ignore patterns (default: standard ignore patterns) */
  ignores?: string[];

  /** Custom rules to merge with default rules */
  rules?: {
    /** Global rules applied to all configurations */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ruleName: string]: any;
    /** Rule-set specific rules */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prettier?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typescript?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yaml?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markdown?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    text?: Record<string, any>;
  };

  /** Environment settings (default: ['node']) */
  environments?: string[];

  /** Custom plugin configurations */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: Record<string, any>;

  /** Custom language options */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  languageOptions?: Record<string, any>;
}

/**
 * Configuration options for individual rule set functions
 */
export interface RuleSetOptions {
  /** Custom rules to merge with default rules */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: Record<string, any>;

  /** Custom plugin configurations */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: Record<string, any>;

  /** Custom language options */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  languageOptions?: Record<string, any>;
}

/**
 * ESLint configuration array type
 */
export type EslintConfig = Linter.Config[];

/**
 * Main factory function to create ESLint configuration
 */
export function createEslintConfig(options?: EslintConfigOptions): EslintConfig;

/**
 * Default export for backward compatibility - returns default configuration
 */
declare const defaultConfig: EslintConfig;
export default defaultConfig;

/**
 * Create JavaScript and TypeScript configurations
 */
export function createJsAndTsConfig(options?: RuleSetOptions): EslintConfig;

/**
 * Create Prettier integration configuration
 */
export function createPrettierConfig(options?: RuleSetOptions): EslintConfig;

/**
 * Create YAML file linting configuration
 */
export function createYamlConfig(options?: RuleSetOptions): EslintConfig;

/**
 * Create JSON file linting configuration
 */
export function createJsonConfig(options?: RuleSetOptions): EslintConfig;

/**
 * Create Markdown file linting configuration
 */
export function createMarkdownConfig(options?: RuleSetOptions): EslintConfig;

/**
 * Create text file linting configuration
 */
export function createTextConfig(options?: RuleSetOptions): EslintConfig;
