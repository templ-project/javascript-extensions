const fs = require('node:fs');

const nodeVersion = 'node22';

const tsconfig = {
  base: {
    extends: `@tsconfig/${nodeVersion}/tsconfig.json`,
    include: [
      '${configDir}/src/**/*.ts',
      '${configDir}/src/**/*.tsx'
    ],
    exclude: [
      '${configDir}/node_modules/**',
      '${configDir}/dist/**',
      '${configDir}/build/**',
      '${configDir}/**/*.test.ts',
      '${configDir}/**/*.spec.ts'
    ],
    compilerOptions: {
      types: ['node'],
      
      // TypeScript Role Requirements - Strict Mode & Type Safety
      strict: true,
      noImplicitAny: true,
      noImplicitReturns: true,
      noImplicitOverride: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      exactOptionalPropertyTypes: true,
      noUncheckedIndexedAccess: true,
      noImplicitThis: true,
      noFallthroughCasesInSwitch: true,
      noPropertyAccessFromIndexSignature: true,

      // Output Configuration
      declaration: false,
      declarationMap: false,
      sourceMap: true,
      removeComments: true,
      importHelpers: true,

      // Module Resolution & Imports
      forceConsistentCasingInFileNames: true,
      verbatimModuleSyntax: false,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      isolatedModules: true,

      // Performance & Build Optimization
      skipLibCheck: true,
      incremental: true,
      composite: false,

      // Paths and Directory Structure
      rootDir: '${configDir}/src',
      outDir: '${configDir}/dist',
      baseUrl: '${configDir}',
      paths: {
        '@/*': ['${configDir}/src/*'],
        '~/*': ['${configDir}/src/*']
      },

      // Advanced TypeScript Features Support
      experimentalDecorators: false,
      emitDecoratorMetadata: false,
      resolveJsonModule: true,
      allowImportingTsExtensions: false
    },
  },
  browser: {
    extends: './base.json',
    compilerOptions: {
      target: 'ES2022',
      module: 'ES2022',
      moduleResolution: 'bundler',
      lib: [
        'ES2022',
        'DOM',
        'DOM.Iterable',
        'WebWorker'
      ],
      types: [
        'web'
      ],
      allowImportingTsExtensions: true,
      noEmit: true,
      jsx: 'preserve',
      jsxImportSource: 'react'
    },
  },
  cjs: {
    extends: './base.json',
    compilerOptions: {
      target: 'ES2022',
      module: 'CommonJS',
      moduleResolution: 'Node10',
      lib: [
        'ES2022'
      ],
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      declaration: true,
      declarationMap: true,
      outDir: '${configDir}/dist/cjs'
    },
  },
  esm: {
    extends: './base.json',
    compilerOptions: {
      target: 'ES2022',
      module: 'ES2022',
      moduleResolution: 'Node',
      lib: [
        'ES2022'
      ],
      allowImportingTsExtensions: false,
      declaration: true,
      declarationMap: true,
      outDir: '${configDir}/dist/esm',
      verbatimModuleSyntax: true
    },
  },
  bun: {
    extends: './base.json',
    compilerOptions: {
      target: 'ES2022',
      module: 'ES2022',
      moduleResolution: 'bundler',
      lib: [
        'ES2022'
      ],
      types: [
        'bun-types'
      ],
      allowImportingTsExtensions: true,
      noEmit: true,
      jsx: 'react-jsx',
      jsxImportSource: 'react',
      verbatimModuleSyntax: false,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      skipLibCheck: true,
      composite: false,
      declaration: false,
      declarationMap: false
    },
  },
  vitest: {
    extends: './base.json',
    include: [
      '${configDir}/src/**/*.ts',
      '${configDir}/src/**/*.tsx',
      '${configDir}/test/**/*.ts',
      '${configDir}/test/**/*.tsx',
      '${configDir}/**/*.test.ts',
      '${configDir}/**/*.test.tsx',
      '${configDir}/**/*.spec.ts',
      '${configDir}/**/*.spec.tsx'
    ],
    compilerOptions: {
      target: 'ES2022',
      module: 'ES2022',
      moduleResolution: 'bundler',
      types: [
        'node',
        'vitest/globals',
        'vitest/importMeta'
      ],
      lib: [
        'ES2022'
      ],
      allowImportingTsExtensions: true,
      noEmit: true,
      composite: false,
      declaration: false,
      declarationMap: false
    },
  },
};

Object.entries(tsconfig).forEach(([key, config]) => fs.writeFileSync(`${key}.json`, JSON.stringify(config, null, 2)));
