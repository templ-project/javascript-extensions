const { prompt } = require('enquirer');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const {
  LANG_COFFEE,
  LANG_FLOW,
  LANG_JS,
  LANG_TS,
  LINT_AIRBNB,
  LINT_ESLINT,
  TEST_JASMINE,
  TEST_JEST,
  TEST_MOCHA,
} = require('./cl/const');
const languagerc = require('./cl/languagerc');
const srcCode = require('./cl/src-code');
const testCode = require('./cl/test-code');
const mocharc = require('./cl/mocharc');

const package = JSON.parse(fs.readFileSync('./package.json').toString());

/****************************************************************************
 * Methods
 ****************************************************************************/

const eslintrc = (answers) => {
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
  template.extends.push(
    answers.lintRules === LINT_ESLINT
      ? 'eslint:recommended'
      : 'eslint-config-airbnb'
  );

  if (answers.language === LANG_COFFEE) {
    // https://www.npmjs.com/package/eslint-plugin-coffee
    ext = 'coffee';
    template.parser = 'eslint-plugin-coffee';
    template.plugins.push('coffee');
    template.extends.push(
      answers.lintRules === LINT_ESLINT
        ? 'plugin:coffee/eslint-recommended'
        : 'plugin:coffee/airbnb-base'
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
    template.extends.push(
      answers.lintRules === LINT_ESLINT
        ? 'plugin:flowtype/recommended'
        : 'eslint-config-airbnb'
    );
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
    template.extends.push(
      answers.lintRules === LINT_ESLINT
        ? 'eslint:recommended'
        : 'eslint-config-airbnb'
    );
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
      answers.lintRules === LINT_ESLINT
        ? 'plugin:@typescript-eslint/recommended'
        : 'eslint-config-airbnb-typescript'
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

  package.scripts = Object.assign({}, package.scripts, {
    lint: `eslint ./{${answers.src},test}/**/*.${ext}`,
    'lint:write': 'npm run lint -- --fix',
    'lint:watch': "nodemon --exec 'npm run lint'",
  });
  return template;
};

const prettierrc = (answers) => {
  const template = {
    parser: 'babel',
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    bracketSpacing: false,
  };
  let ext = '{js,jsx}';
  if (answers.language === LANG_COFFEE) {
    ext = 'coffee';
    template.parser = 'coffeescript';
    package.devDependencies = Object.assign({}, package.devDependencies, {
      'prettier-plugin-coffeescript': '^0.1.5',
    });
  }
  if (answers.language === LANG_FLOW) {
    template.parser = 'flow';
    package.devDependencies = Object.assign({}, package.devDependencies, {
      'flow-parser': '^0.136.0',
    });
  }
  if (answers.language === LANG_TS) {
    ext = '{ts,tsx}';
    template.parser = 'typescript';
  }
  package.scripts = Object.assign({}, package.scripts, {
    prettier: `prettier ./{${answers.src},test}/**/*.${ext}`,
    'prettier:check': 'npm run prettier -- --list-different',
    'prettier:write': 'npm run prettier -- --write',
  });
  return template;
};

const to_rc = (obj, label = '.prettierrc') => {
  fs.writeFileSync(
    `${label}.js`,
    `// ${label}.js
module.exports = ${JSON.stringify(obj, null, 2)};`
  );
};

const to_package = (obj, label = 'prettier') => {
  package[label] = obj;
  return package;
};

// const depcruise = (answers) => {
//   if (answers.inspectors.includes('dependency-cruiser')) {
//     package.scripts = Object.assign({}, package.scripts, {
//       depcruise: `depcruise --config .dependency-cruiser.js ${answers.src}`,
//     });

//     console.clear();
//     console.log('Proceding to configuring `dependency-cruiser`');
//     const program = require('commander');
//     program.init = true;
//     const cli = require('dependency-cruiser/src/cli');
//     cli([], program);
//   } else {
//     package.devDependencies = removeKeys(package.devDependencies, ['dependency-cruiser']);
//   }
// };

const jscpd = (answers) => {
  if (!answers.inspectors.includes('jscpd')) {
    return;
  }

  const template = {
    absolute: true,
    blame: true,
    ignore: ['**/__snapshots__/**', '**/*.min.js', '**/*.map'],
    output: '.jscpd',
    reporters: ['console', 'badge'],
    threshold: 0.1,
  };

  fs.writeFileSync('.jscpd.json', JSON.stringify(template, null, 2));

  package.devDependencies = Object.assign({}, package.devDependencies, {
    jscpd: '^2.0.16',
    'jscpd-badge-reporter': '^1.1.3',
  });
  package.scripts = Object.assign({}, package.scripts, {
    jscpd: `jscpd ./${answers.src} --blame --format ${
      answers.language !== LANG_FLOW
        ? answers.language === LANG_COFFEE
          ? 'coffeescript'
          : answers.language
        : LANG_JS
    }`,
    'jscpd:html': 'npm run jscpd -- --reporters html',
  });
};

const sortByKeys = (obj) => {
  let keys = Object.getOwnPropertyNames(obj).sort();
  const newObj = {};
  for (key of keys) {
    if (typeof obj[key] !== 'object' && !Array.isArray(obj[key])) {
      newObj[key] = obj[key];
    } else {
      newObj[key] = sortByKeys(obj[key]);
    }
  }
  return newObj;
};

const removeKeys = (obj, keys) => {
  const newObj = {};
  const okeys = Object.getOwnPropertyNames(obj).filter((key) =>
    keys.find((lkey) => lkey === key)
  );
  for (const okey of okeys) {
    newObj[okey] = obj[okey];
  }
  return newObj;
};

const repository = (answers) => {
  repositories = {
    bitbucket: '',
    gitea: '.github',
    gitee: '',
    github: '.github',
    gitlab: '.gitlab',
  };
  Object.getOwnPropertyNames(repositories)
    .filter(
      (item) =>
        repositories[item] !== repositories[answers.repository] &&
        repositories[item].length
    )
    .forEach((item) => rimraf.sync(repositories[item]));
};

// const jestrc = (answers) => {
//   if (!answers.testing !== TEST_JEST) {
//     return;
//   }
//   const template = {
//     moduleFileExtensions: ['js', 'json', 'ts'],
//     rootDir: 'src',
//     testRegex: '.spec.ts$',
//     transform: {
//       '^.+\\.(t|j)s$': 'ts-jest',
//     },
//     coverageDirectory: '../coverage',
//     testEnvironment: 'node',
//   };
//   //     answers.to === "rc"
//   //       ? to_rc(configs[answers.language].jestrc, "jest.config")
//   //       : to_package(configs[answers.language].jestrc, "jest");
//   //     package.devDependencies = Object.assign({}, package.devDependencies, {
//   //       "eslint-plugin-jest": "^23.18.0",
//   //       jest: "^26.1.0",
//   //       "ts-jest": "^26.1.1",
//   //       "ts-loader": "^8.0.0",
//   //     });
//   //     if (answers.language === "typescript") {
//   //       package.devDependencies = Object.assign({}, package.devDependencies, {
//   //         "@types/jest": "^26.0.4",
//   //       });
//   //     }
// };

/****************************************************************************
 * Settings
 ****************************************************************************/

const questions = [
  {
    type: 'select',
    name: 'language',
    message: 'Choose JavaScript Flavor',
    choices: [
      'javascript',
      'typescript',
      { name: 'flow', disabled: true },
      { name: 'coffee', disabled: true },
    ],
  },
  {
    type: 'select',
    name: 'lintRules',
    message: 'Choose Linting Rules',
    choices: [
      { name: 'airbnb', label: 'Airbnb' },
      { name: 'eslint', label: 'ESLint Recommended' },
    ],
    initial: 'eslint',
  },
  {
    type: 'select',
    name: 'testing',
    message: 'Choose Testing Framework',
    choices: [{ name: 'jasmine', disabled: true }, 'jest', 'mocha'],
    initial: 'mocha',
  },
  {
    type: 'multiselect',
    name: 'inspectors',
    message: 'Choose Code Inspectors',
    choices: ['jscpd', 'dependency-cruiser'],
    initial: ['jscpd'],
  },
  {
    type: 'select',
    name: 'repository',
    message: 'Choose Git Repository Manager',
    choices: [
      { name: 'bitbucket', disabled: true },
      { name: 'gitea', disabled: true },
      { name: 'gitee', disabled: true },
      'github',
      'gitlab',
    ],
    initial: ['github'],
  },
  {
    type: 'select',
    name: 'src',
    message: 'Choose Src Folder',
    choices: ['app', 'src'],
    initial: 'src',
  },
  {
    type: 'select',
    name: 'dist',
    message: 'Choose Dist Folder',
    choices: ['dist', 'lib'],
    initial: 'dist',
  },
  {
    type: 'select',
    name: 'to',
    message: 'Write configs to',
    choices: [{ name: 'rc', message: 'Separate Files' }, { name: 'package' }],
    initial: ['rc'],
  },
];

const init = (answers) => {
  console.log(answers);

  languagerc(answers, package);

  // .eslintrc
  answers.to === 'rc'
    ? to_rc(eslintrc(answers), '.eslintrc')
    : to_package(eslintrc(answers), 'eslint');

  // .prettierrc
  to_rc(prettierrc(answers), '.prettierrc');

  // src & test
  srcCode(answers);
  testCode(answers);

  // testing
  mocharc(answers);
  // jestrc(answers);

  // .jscpd
  jscpd(answers);

  // .dependency-cruise.js
  // depcruise(answers);

  repository(answers);

  package.dependencies = sortByKeys(package.dependencies || {});
  package.devDependencies = sortByKeys(package.devDependencies || {});
  package.scripts = sortByKeys(package.scripts || {});

  fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
};

console.clear();
if (process.env.TEMPLATE_ANSWERS) {
  init(JSON.parse(process.env.TEMPLATE_ANSWERS));
} else {
  prompt(questions)
    .then((answers) => init(answers))
    .catch(console.error);
}
