import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';

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
});

type TestOptions = {
  type: 'browser' | 'cjs' | 'esm';
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
