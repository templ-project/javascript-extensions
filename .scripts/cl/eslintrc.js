const {LANG_COFFEE, LANG_FLOW, LANG_JS, LANG_TS, LINT_ESLINT, LINT_AIRBNB, TEST_MOCHA, TEST_JEST} = require('./const');

const eslintrc = (answers, package) => {
  const template = {
    env: {
      browser: true,
      es6: true,
      node: true,
      mocha: true,
    },
    extends: [],
    plugins: [],
    root: true,
    rules: {
      'consistent-return': 2,
      indent: [1, 2],
      'no-else-return': 1,
      // semi: [1, "always"],
      'space-unary-ops': 2,
    },
  };

  let ext = '{js,jsx}';
  template.extends.push(answers.lintRules === LINT_ESLINT ? 'eslint:recommended' : 'eslint-config-airbnb');

  if (answers.language === LANG_COFFEE) {
    // https://www.npmjs.com/package/eslint-plugin-coffee
    ext = 'coffee';
    template.parser = 'eslint-plugin-coffee';
    template.plugins.push('coffee');
    template.extends.push(
      answers.lintRules === LINT_ESLINT ? 'plugin:coffee/eslint-recommended' : 'plugin:coffee/airbnb-base',
    );
    package.devDependencies = Object.assign({}, package.devDependencies, {
      'eslint-plugin-coffee': '^0.1.13',
    });
  } else {
    template.rules = Object.assign({}, template.rules, {
      indent: [1, 2],
    });
  }

  if (answers.language === LANG_FLOW) {
    // https://www.npmjs.com/package/eslint-plugin-flowtype
    template.parser = 'babel-eslint';
    template.parserOptions = {
      ecmaVersion: 2018,
      sourceType: 'module',
    };
    template.plugins.push('flowtype');
    template.extends.push(answers.lintRules === LINT_ESLINT ? 'plugin:flowtype/recommended' : 'eslint-config-airbnb');
    if (answers.lintRules === LINT_AIRBNB) {
      template.extends.push('eslint-config-airbnb-flow');
    }
    package.devDependencies = Object.assign({}, package.devDependencies, {
      'babel-eslint': '^10.1.0',
      'eslint-config-airbnb': '^1.0.2',
      'eslint-config-airbnb-flow': '^1.0.2',
      'eslint-plugin-flowtype': '^5.2.0',
    });
  }

  if (answers.language === LANG_JS) {
    template.parser = 'babel-eslint';
    template.parserOptions = {
      ecmaVersion: 2018,
      sourceType: 'module',
    };
    package.devDependencies = Object.assign({}, package.devDependencies, {
      'babel-eslint': '^10.1.0',
      'eslint-config-airbnb': '^1.0.2',
    });
  }

  if (answers.language === LANG_TS) {
    ext = '{ts,tsx}';
    template.parser = '@typescript-eslint/parser';
    template.plugins.push('@typescript-eslint');
    template.extends.push(
      answers.lintRules === LINT_ESLINT ? 'plugin:@typescript-eslint/recommended' : 'eslint-config-airbnb-typescript',
    );
    package.devDependencies = Object.assign({}, package.devDependencies, {
      '@typescript-eslint/eslint-plugin': '^2.30.0',
      '@typescript-eslint/parser': '^2.30.0',
      'eslint-config-airbnb-typescript': '^12.0.0',
      typescript: '^3.8.3',
    });
  }

  if (answers.testing === TEST_MOCHA) {
    template.extends.push('plugin:mocha/recommended');
    template.plugins.push('mocha');
  }

  if (answers.testing === TEST_JEST) {
    template.extends.push('plugin:jest/recommended');
    template.plugins.push('jest');
  }

  package.scripts = Object.assign({}, package.scripts, {
    lint: `eslint ./{${answers.src},test}/**/*.${ext}`,
    'lint:write': 'npm run lint -- --fix',
    'lint:watch': "nodemon --exec 'npm run lint'",
  });
  return template;
};

module.exports = eslintrc;
