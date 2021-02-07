const fs = require('fs');

const {LANG_COFFEE, LANGS, LINT_ESLINT, LINT_AIRBNB, LINTS, TEST_MOCHA, TEST_JEST, TESTS, LANG_TS} = require('./const');
const twig = require('./twig');

const eslintrc = async (answers, package) => {
  let ext = 'js';

  const options = {
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
    LINTS,
    TESTS,
  };

  /**************************************************************************
   * CoffeeScript
   **************************************************************************/

  if (answers.language === LANGS.LANG_COFFEE) {
    // https://www.npmjs.com/package/eslint-plugin-coffee
    ext = 'coffee';

    // eslint settings for coffee
    options.eslint.parser = 'eslint-plugin-coffee';
    options.eslint.plugins = [...options.eslint.plugins, 'coffee'];
    options.eslint.extends = [
      ...options.eslint.extends,
      answers.lintRules === LINT_ESLINT ? 'plugin:coffee/eslint-recommended' : 'plugin:coffee/airbnb-base',
    ];

    // packages for coffee
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      'eslint-plugin-coffee': '?',
    };
  }

  /**************************************************************************
   * non CoffeeScript
   **************************************************************************/

  if (answers.language !== LANG_COFFEE) {
    // generic lint rules for non coffee
    options.eslint.rules = Object.assign({}, options.eslint.rules, {
      indent: [1, 2],
      semi: [1, 'always'],
    });
  }

  /**************************************************************************
   * Flow
   **************************************************************************/

  if (answers.language === LANGS.LANG_FLOW) {
    // https://www.npmjs.com/package/eslint-plugin-flowtype
    options.eslint = {
      ...options.eslint,
      extends: [
        ...options.eslint.extends,
        'plugin:flowtype/recommended',
        answers.lintRules === LINT_AIRBNB ? 'airbnb-base' : '',
        // answers.lintRules === LINT_AIRBNB ? 'airbnb-flow' : '',
        answers.lintRules === LINT_ESLINT ? 'eslint:recommended' : '',
      ].filter((a) => a),
      parser: 'babel-eslint',
      // parserOptions: {
      //   ecmaVersion: 2018,
      //   sourceType: 'module',
      // },
      plugins: [
        ...options.eslint.plugins,
        'flowtype',
        // answers.lintRules === LINT_AIRBNB ? 'import' : '',
      ].filter((a) => a),
      rules: {
        ...options.eslint.rules,
        ...(answers.lintRules === LINT_AIRBNB
          ? {
              'import/prefer-default-export': 'off', // this is react ruled, not gonna happen
              'import/no-extraneous-dependencies': 'off', // this is not a good idea when required packages are actually test packages
            }
          : {}),
      },
    };

    // packages for flow
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      'babel-eslint': '?',
      'eslint-plugin-flowtype': '?',
      // ...(answers.lintRules === LINT_AIRBNB
      //   ? {
      //       'eslint-config-airbnb-base': '?',
      //       'eslint-config-airbnb-flow': '?',
      //       'eslint-plugin-import': '?',
      //     }
      //   : {}),
    };
  }

  /**************************************************************************
   * JavaScript
   **************************************************************************/

  if (answers.language === LANGS.LANG_JS) {
    options.eslint = {
      ...options.eslint,
      extends: [
        ...options.eslint.extends,
        answers.lintRules === LINT_AIRBNB ? 'airbnb-base' : '',
        answers.lintRules === LINT_ESLINT ? 'eslint:recommended' : '',
      ].filter((a) => a),
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      plugins: [
        ...options.eslint.plugins,
        answers.lintRules === LINT_AIRBNB ? 'import' : '',
      ].filter(a => a),
      rules: {
        ...options.eslint.rules,
        'import/prefer-default-export': 'off', // this is react ruled, not gonna happen
        'import/no-extraneous-dependencies': 'off', // this is not a good idea when required packages are actually test packages
      },
    };

    // packages for js
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      'babel-eslint': '?',

      ...(answers.lintRules === LINT_AIRBNB
        ? {
            'eslint-config-airbnb-base': '?',
            'eslint-plugin-import': '?',
          }
        : {}),
    };
  }

  /**************************************************************************
   * TypeScript
   **************************************************************************/

  if (answers.language === LANGS.LANG_TS) {
    ext = 'ts';

    options.eslint = {
      ...options.eslint,
      extends: [
        ...options.eslint.extends,
        // answers.lintRules === LINT_AIRBNB ? 'airbnb-base' : '',
        'plugin:@typescript-eslint/recommended',
        answers.lintRules === LINT_AIRBNB ? 'airbnb-typescript/base' : '',
        // answers.lintRules === LINT_ESLINT ? 'eslint:recommended' : '',
      ].filter((a) => a),
      parser: '@typescript-eslint/parser',
      plugins: [
        ...options.eslint.plugins,
        '@typescript-eslint',
        answers.lintRules === LINT_AIRBNB ? 'import' : '',
      ].filter(a => a),
      rules: {
        ...options.eslint.rules,
        'import/prefer-default-export': 'off', // this is react ruled, not gonna happen
        'import/no-extraneous-dependencies': 'off', // this is not a good idea when required packages are actually test packages
      },

      ...(answers.lintRules === LINT_AIRBNB
        ? {
            parserOptions: {
              project: './tsconfig.eslint.json',
            },
          }
        : {}),
    };

    // packages for ts
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      typescript: '?',
      '@typescript-eslint/eslint-plugin': '?',
      '@typescript-eslint/parser': '?',

      ...(answers.lintRules === LINT_AIRBNB
        ? {
            // 'eslint-config-airbnb-base': '?',
            // 'eslint-plugin-import': '?',
            'eslint-config-airbnb-typescript': '?',
            'eslint-plugin-import': '?',
          }
        : {}),
    };

    const rendered = await twig('./.scripts/cl/twig/.eslintrc.tsconfig.json.twig', options);

    try {
      await fs.promises.unlink('./tsconfig.eslint.json');
    } catch (e) {}
    await fs.promises.writeFile('./tsconfig.eslint.json', rendered);
  }

  /**************************************************************************
   * non CoffeeScript / lint:airbnb
   **************************************************************************/

  if (answers.lintRules === LINT_AIRBNB && answers.language !== LANG_COFFEE && answers.language !== LANG_TS) {
    options.eslint.extends = [...options.eslint.extends, 'prettier'];
    options.eslint.plugins = [...options.eslint.plugins, 'prettier'];

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      'eslint-config-prettier': '?',
      'eslint-plugin-prettier': '?',
    };
  }

  /**************************************************************************
   * test:mocha
   **************************************************************************/

  if (answers.testing === TEST_MOCHA) {
    options.eslint.extends = [...options.eslint.extends, 'plugin:mocha/recommended'];
  }

  /**************************************************************************
   * test:jest
   **************************************************************************/

  if (answers.testing === TEST_JEST) {
    options.eslint.extends = [...options.eslint.extends, 'plugin:jest/recommended'];
  }

  /**************************************************************************
   * generic scripts
   **************************************************************************/

  package.scripts = Object.assign({}, package.scripts, {
    lint: `eslint ./{${answers.src},test}/**/*.${ext}`,
    'lint:write': 'npm run lint -- --fix',
    'lint:watch': "nodemon --exec 'npm run lint'",
  });

  // console.log(
  //   // answers,
  //   options,
  //   // package,
  // );
  // process.exit(1)

  const rendered = await twig('./.scripts/cl/twig/.eslintrc.js.twig', options);

  try {
    await fs.promises.unlink('./.eslintrc.js');
  } catch (e) {}
  return fs.promises.writeFile('./.eslintrc.js', rendered);
};

module.exports = eslintrc;
