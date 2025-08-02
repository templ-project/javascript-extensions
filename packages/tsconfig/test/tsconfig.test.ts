import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('tsc compile', () => {
  setupTest({
    type: 'browser',
    expects: {
      'should have esm output': () => {
        const output = fs.readFileSync(path.join(__dirname, 'success', 'dist', 'index.js'), 'utf-8');
        expect(output).toContain('export const hello');
      },
    },
  });

  setupTest({
    type: 'cjs',
    expects: {
      'should have cjs output': () => {
        const output = fs.readFileSync(path.join(__dirname, 'success', 'dist', 'index.js'), 'utf-8');
        expect(output).toContain('exports.hello = hello');
      },
    },
  });

  setupTest({
    type: 'esm',
    expects: {
      'should have esm output': () => {
        const output = fs.readFileSync(path.join(__dirname, 'success', 'dist', 'index.js'), 'utf-8');
        expect(output).toContain('export const hello');
      },
    },
  });

  setupTest({
    type: 'bun',
    expects: {
      'should have esm output for bun': () => {
        const output = fs.readFileSync(path.join(__dirname, 'success', 'dist', 'index.js'), 'utf-8');
        expect(output).toContain('export const hello');
      },
    },
  });

  setupTest({
    type: 'vitest',
    expects: {
      'should compile test files': () => {
        const output = fs.readFileSync(path.join(__dirname, 'success', 'dist', 'index.js'), 'utf-8');
        expect(output).toContain('export const hello');
      },
    },
  });
});

describe('TypeScript Role Requirements Validation', () => {
  describe('base.json configuration', () => {
    let baseConfig: any;

    beforeAll(() => {
      const configPath = path.join(__dirname, '..', 'base.json');
      baseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    });

    it('should enforce strict mode', () => {
      expect(baseConfig.compilerOptions.strict).toBe(true);
    });

    it('should enforce comprehensive strict settings', () => {
      expect(baseConfig.compilerOptions.noImplicitAny).toBe(true);
      expect(baseConfig.compilerOptions.noImplicitReturns).toBe(true);
      expect(baseConfig.compilerOptions.noUnusedLocals).toBe(true);
      expect(baseConfig.compilerOptions.noUnusedParameters).toBe(true);
      expect(baseConfig.compilerOptions.exactOptionalPropertyTypes).toBe(true);
      expect(baseConfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
      expect(baseConfig.compilerOptions.noImplicitThis).toBe(true);
      expect(baseConfig.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
      expect(baseConfig.compilerOptions.noPropertyAccessFromIndexSignature).toBe(true);
    });

    it('should include path mapping configuration', () => {
      expect(baseConfig.compilerOptions.baseUrl).toBeDefined();
      expect(baseConfig.compilerOptions.paths).toBeDefined();
      expect(baseConfig.compilerOptions.paths['@/*']).toEqual(['${configDir}/src/*']);
      expect(baseConfig.compilerOptions.paths['~/*']).toEqual(['${configDir}/src/*']);
    });

    it('should include performance optimizations', () => {
      expect(baseConfig.compilerOptions.skipLibCheck).toBe(true);
      expect(baseConfig.compilerOptions.incremental).toBe(true);
    });

    it('should include TypeScript and JSX support', () => {
      expect(baseConfig.include).toContain('${configDir}/src/**/*.ts');
      expect(baseConfig.include).toContain('${configDir}/src/**/*.tsx');
    });

    it('should exclude test files from compilation', () => {
      expect(baseConfig.exclude).toContain('${configDir}/**/*.test.ts');
      expect(baseConfig.exclude).toContain('${configDir}/**/*.spec.ts');
    });
  });

  describe('bun.json configuration', () => {
    let bunConfig: any;

    beforeAll(() => {
      const configPath = path.join(__dirname, '..', 'bun.json');
      expect(fs.existsSync(configPath)).toBe(true);
      bunConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    });

    it('should extend base configuration', () => {
      expect(bunConfig.extends).toBe('./base.json');
    });

    it('should be optimized for Bun runtime', () => {
      expect(bunConfig.compilerOptions.target).toBe('ES2022');
      expect(bunConfig.compilerOptions.module).toBe('ES2022');
      expect(bunConfig.compilerOptions.moduleResolution).toBe('bundler');
    });

    it('should include Bun types', () => {
      expect(bunConfig.compilerOptions.types).toContain('bun-types');
    });

    it('should support JSX for React', () => {
      expect(bunConfig.compilerOptions.jsx).toBe('react-jsx');
      expect(bunConfig.compilerOptions.jsxImportSource).toBe('react');
    });
  });

  describe('runtime-specific configurations', () => {
    it('browser.json should target modern browsers', () => {
      const configPath = path.join(__dirname, '..', 'browser.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(config.compilerOptions.target).toBe('ES2022');
      expect(config.compilerOptions.lib).toContain('DOM');
      expect(config.compilerOptions.lib).toContain('DOM.Iterable');
    });

    it('cjs.json should target CommonJS', () => {
      const configPath = path.join(__dirname, '..', 'cjs.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(config.compilerOptions.module).toBe('CommonJS');
      expect(config.compilerOptions.target).toBe('ES2022');
    });

    it('esm.json should target ESM', () => {
      const configPath = path.join(__dirname, '..', 'esm.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(config.compilerOptions.module).toBe('ES2022');
      expect(config.compilerOptions.verbatimModuleSyntax).toBe(true);
    });

    it('vitest.json should support testing', () => {
      const configPath = path.join(__dirname, '..', 'vitest.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      expect(config.compilerOptions.types).toContain('vitest/globals');
      expect(config.include).toContain('${configDir}/**/*.test.ts');
    });
  });
});

type TestOptions = {
  type: 'browser' | 'cjs' | 'esm' | 'bun' | 'vitest';
  expects?: Record<string, () => void>;
};

function setupTest({ type = 'browser', expects = {} }: TestOptions) {
  describe('compiling for browser', () => {
    let error: Error | null = null;

    beforeAll(async () => {
      fs.writeFileSync(
        path.join(__dirname, 'success', 'tsconfig.json'),
        JSON.stringify(
          {
            extends: `../../${type}.json`,
          },
          null,
          2,
        ),
      );

      try {
        await execa({
          preferLocal: true,
          cwd: path.join(__dirname, 'success'),
        })`npx tsc -p .`;
      } catch (e) {
        error = e;
      }
    });

    it('should not throw errors', () => {
      expect(error).toBe(null);
    });

    if (Object.keys(expects).length) {
      describe('custom tests', () => {
        Object.entries(expects).forEach(([name, call]) => {
          // eslint-disable-next-line vitest/valid-title, vitest/expect-expect
          it(name, () => call());
        });
      });
    }
  });
}
