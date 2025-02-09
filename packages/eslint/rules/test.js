export default [
  {
    name: 'cblt:*.txt--eol-last',
    files: ['**/*.txt'], // Apply only to .txt files
    languageOptions: {
      parser: {
        parse: (txt) => {
          const lines = txt.split('\n');
          return {
            type: 'Program',
            sourceType: 'module',
            comments: [],
            tokens: [],
            body: [],
            range: [0, txt.length],
            loc: {
              start: {
                line: 1,
                column: 0,
              },
              end: {
                line: lines.length,
                column: lines[lines.length - 1].length,
              },
            },
          };
        },
      },
    },
    rules: {
      'eol-last': ['error', 'always'],
    },
  },
  {
    name: 'cblt:all-other-text-files--eol-last',
    files: ['**/*.json', '**/*.jsonc', '**/*.md', '**/*.yml', '**/*.yaml'],
    rules: {
      'eol-last': ['error', 'always'],
    },
  },
];
