import vitestConfig from './dist/index.js';

describe('default export: defineConfig', () => {
  describe('when called with no parameters', () => {
    it('should return the config object using all baked in defaults', () => {
      const result = vitestConfig();

      expect(result).toBeInstanceOf(Object);
      expect(result.test).toBeInstanceOf(Object);
      expect(result.test).to.containSubset({
        globals: true,
        include: ['js', 'ts']
          .map((ext) => [`src/**/*.spec.${ext}`, `test/**/*.test.${ext}`, `test/**/*.e2e.${ext}`])
          .reduce((acc, ext) => [...acc, ...ext], []),
        reporters: ['verbose'],
      });

      expect(result.test?.coverage?.exclude).toContain('src/test/**/*');
    });
  });

  describe('when called with explicit excludes', () => {
    it('should pass user settings', () => {
      const result = vitestConfig({
        include: ['my-super-pattern'],
        exclude: ['my-patterns'],
        reporters: ['custom-reporter'],
        coverage: { exclude: ['nothing/please'] },
      });

      expect(result).toBeInstanceOf(Object);

      expect(result.test).to.containSubset({
        include: ['my-super-pattern'],
        exclude: ['my-patterns'],
        reporters: ['custom-reporter'],
      });

      expect(result.test?.coverage?.exclude).toContain('nothing/please');
    });
  });
});
