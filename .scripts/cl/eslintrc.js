const fs = require('fs');

const {LANGS, LINT_ESLINT, LINT_AIRBNB, TEST_MOCHA, TEST_JEST} = require('./const');
const twig = require('./twig');

const eslintrc = async (answers, package) => {
  let ext = '{js,jsx}';

  options = {
    answers,
    eslint: {
      parser: '',
      plugins: [],
      extends: [],
      rules: {
        'consistent-return': 2,
        'no-else-return': 1,
        'space-unary-ops': 2,
      },
    },
    LANGS,
  }

  options.eslint.extends = [
    ...options.eslint.extends,
    answers.lintRules === LINT_ESLINT ? 'eslint:recommended' : 'eslint-config-airbnb/base'
  ];

  if (answers.language === LANGS.LANG_COFFEE) {
    // https://www.npmjs.com/package/eslint-plugin-coffee
    ext = 'coffee';
    options.eslint.parser = 'eslint-plugin-coffee';
    options.eslint.plugins = [
      ...options.eslint.plugins,
      'coffee'
    ];
    options.eslint.extends = [
      ...options.eslint.extends,
      answers.lintRules === LINT_ESLINT ? 'plugin:coffee/eslint-recommended' : 'plugin:coffee/airbnb-base',
    ];

    package.devDependencies = {
      ...package.devDependencies,
      'eslint-plugin-coffee': '^0.1.13',
    };
  } else {
    options.eslint.rules = Object.assign({}, options.eslint.rules, {
      indent: [1, 2],
      semi: [1, "always"],
    });
  }

  if (answers.language === LANGS.LANG_FLOW) {
    // https://www.npmjs.com/package/eslint-plugin-flowtype
    options.eslint.parser = 'babel-eslint';
    options.eslint.parserOptions = {
      ecmaVersion: 2018,
      sourceType: 'module',
    };
    options.eslint.plugins = [
      ...options.eslint.plugins,
      'flowtype'
    ];
    options.eslint.extends = [
      ...options.eslint.extends,
      answers.lintRules === LINT_ESLINT ? 'plugin:flowtype/recommended' : 'eslint-config-airbnb/base',
      answers.lintRules === LINT_AIRBNB ? 'eslint-config-airbnb-flow' : '',
    ].filter(a => a);

    package.devDependencies = {
      ...package.devDependencies,
      'babel-eslint': '^10.1.0',
      'eslint-config-airbnb': '^1.0.2',
      'eslint-config-airbnb-flow': '^1.0.2',
      'eslint-plugin-flowtype': '^5.2.0',
      'eslint-plugin-react': '^7.21.5',
    };
  }

  if (answers.language === LANGS.LANG_JS) {
    options.eslint.parser = 'babel-eslint';
    options.eslint.parserOptions = {
      ecmaVersion: 2018,
      sourceType: 'module',
    };

    package.devDependencies = Object.assign({}, package.devDependencies, {
      'babel-eslint': '^10.1.0',
      'eslint-config-airbnb': '^1.0.2',
      'eslint-plugin-react': '^7.21.5',
    });
  }

  if (answers.language === LANGS.LANG_TS) {
    ext = '{ts,tsx}';
    options.eslint.parser = '@typescript-eslint/parser';
    options.eslint.plugins = [
      ...options.eslint.plugins,
      '@typescript-eslint'
    ];
    options.eslint.extends = [
      ...options.eslint.extends,
      answers.lintRules === LINT_ESLINT ? 'plugin:@typescript-eslint/recommended' : 'eslint-config-airbnb-typescript',
    ];

    package.devDependencies = Object.assign({}, package.devDependencies, {
      '@typescript-eslint/eslint-plugin': '^2.30.0',
      '@typescript-eslint/parser': '^2.30.0',
      'eslint-config-airbnb-typescript': '^12.0.0',
      typescript: '^3.8.3',
    });
  }

  if (answers.testing === TEST_MOCHA) {
    options.eslint.extends = [
      ...options.eslint.extends,
      'plugin:mocha/recommended',
      'mocha'
    ];
  }

  if (answers.testing === TEST_JEST) {
    options.eslint.extends = [
      ...options.eslint.extends,
      'plugin:jest/recommended',
      'jest'
    ];
  }

  package.scripts = Object.assign({}, package.scripts, {
    lint: `eslint ./{${answers.src},test}/**/*.${ext}`,
    'lint:write': 'npm run lint -- --fix',
    'lint:watch': "nodemon --exec 'npm run lint'",
  });

  const rendered = await twig('./.scripts/cl/twig/.eslintrc.js.twig', options)

  try {
    await fs.promises.unlink('./.eslintrc.js');
  } catch (e) {}
  return fs.promises.writeFile('./.eslintrc.js', rendered)
};

module.exports = eslintrc;
