import { defineConfig, configDefaults, ViteUserConfig } from 'vitest/config';

export default (
  {
    include = ['js', 'ts']
      .map((ext) => [`src/**/*.spec.${ext}`, `test/**/*.test.${ext}`, `test/**/*.e2e.${ext}`])
      .reduce((acc, ext) => [...acc, ...ext], []),
    reporters = ['verbose'],
    coverage: { exclude = [...configDefaults.exclude, 'src/test/**/*'], ...coverage } = {},
    ...test
  } = {} as Exclude<ViteUserConfig['test'], undefined>,
) =>
  defineConfig({
    test: {
      globals: true,
      include,
      reporters,
      coverage: {
        exclude,
        ...coverage,
      },
      ...test,
    },
  });
