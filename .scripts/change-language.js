const {prompt} = require('enquirer');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const package = JSON.parse(fs.readFileSync('./package.json').toString());

const LANG_COFFEE = 'coffee';
const LANG_FLOW = 'flow';
const LANG_JS = 'javascript';
const LANG_TS = 'typescript';

const LINT_ESLINT = 'eslint';
const LINT_AIRBNB = 'airbnb';

const TEST_JASMINE = 'jasmine';
const TEST_JEST = 'test';
const TEST_MOCHA = 'mocha';

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
    template.extends.push(answers.lintRules === LINT_ESLINT ? 'eslint:recommended' : 'eslint-config-airbnb');
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

  // if (answers.testing === TEST_MOCHA) {
  //   template.extends.push("plugin:mocha/recommended");
  //   template.plugins.push("mocha");
  // }

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

const srcCode = (answers) => {
  fs.mkdirSync(answers.src, {recursive: true});

  let template = '';
  let ext = 'js';
  switch (answers.language) {
    case LANG_COFFEE:
      ext = 'coffee';
      template = 'export hello = (name) -> "Hello " + name + "!"';
      break;
    case LANG_TS:
      ext = 'ts';
      template = 'export const hello = (name: string): string => `Hello ${name}!`;';
      break;
    case LANG_FLOW:
      template = `// @flow
export const hello = (name: string): string => \`Hello \${name}!\`;`;
      break;
    default:
      template = 'export const hello = (name) => `Hello ${name}!`;';
  }
  fs.writeFileSync(path.join(answers.src, `index.${ext}`), template);
};

const to_rc = (obj, label = '.prettierrc') => {
  fs.writeFileSync(
    `${label}.js`,
    `// ${label}.js
module.exports = ${JSON.stringify(obj, null, 2)};`,
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
    jscpd: `jscpd ./${answers.src} --blame --format ${answers.language !== LANG_FLOW ? answers.language === LANG_COFFEE ? 'cofeescript' : answers.language : LANG_JS}`,
    'jscpd:html': 'npm run jscpd -- --reporters html',
  });
};

// const sortByKeys = (obj) => {
//   let keys = Object.getOwnPropertyNames(obj).sort();
//   const newObj = {};
//   for (key of keys) {
//     if (typeof obj[key] !== 'object' && !Array.isArray(obj[key])) {
//       newObj[key] = obj[key];
//     } else {
//       newObj[key] = sortByKeys(obj[key]);
//     }
//   }
//   return newObj;
// };

// const removeKeys = (obj, keys) => {
//   const newObj = {};
//   const okeys = Object.getOwnPropertyNames(obj).filter((key) => keys.find((lkey) => lkey === key));
//   for (const okey of okeys) {
//     newObj[okey] = obj[okey];
//   }
//   return newObj;
// };

// const repository = (answers) => {
//   repositories = {
//     bitbucket: '',
//     gitea: '.github',
//     gitee: '',
//     github: '.github',
//     gitlab: '.gitlab',
//   };
//   Object
//     .getOwnPropertyNames(repositories)
//     .filter((item) => repositories[item] !== repositories[answers.repository] && repositories[item].length)
//     .forEach((item) => rimraf.sync(repositories[item]))
// };

// const mocharc = (answers) => {
//   if (!answers.testing === TEST_MOCHA) {
//     return;
//   }
//   const template = {
//     recursive: true,
//     reporter: 'spec',
//     timeout: 5000,
//     require: [
//       'chai/register-assert', // Using Assert style
//       'chai/register-expect', // Using Expect style
//       'chai/register-should', // Using Should style
//     ],
//   };

//   if (answers.language === LANG_JS) {
//     template.require.unshift('@babel/register');
//   }
//   if (answers.language === LANG_TS) {
//     template.require.unshift('ts-node/register');
//   }

//   answers.to === 'rc'
//     ? to_rc(template, '.mocharc')
//     : to_package(template, 'mocha');

//   package.devDependencies = Object.assign({}, package.devDependencies, {
//     'eslint-plugin-mocha': '^7.0.1',
//     mocha: '^8.0.1',
//     'mocha-junit-reporter': '^2.0.0',
//   });

//   if (answers.language === LANG_JS) {
//     package.devDependencies = Object.assign({}, package.devDependencies, {
//       '@babel/register': '^7.12.1',
//     })
//   }

//   if (answers.language === LANG_TS) {
//     package.devDependencies = Object.assign({}, package.devDependencies, {
//       '@types/chai': '^4.2.11',
//       '@types/mocha': '^7.0.2',
//     });
//   }
// };

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
    choices: ['javascript', 'typescript', {name: 'flow', disabled: true}, {name: 'coffee', disabled: true}],
  },
  {
    type: 'select',
    name: 'lintRules',
    message: 'Choose Linting Rules',
    choices: [
      {name: 'airbnb', label: 'Airbnb'},
      {name: 'eslint', label: 'ESLint Recommended'},
    ],
    initial: 'eslint',
  },
  {
    type: 'select',
    name: 'testing',
    message: 'Choose Testing Framework',
    choices: [{name: 'jasmine', disabled: true}, 'jest', 'mocha'],
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
      {name: 'bitbucket', disabled: true},
      {name: 'gitea', disabled: true},
      {name: 'gitee', disabled: true},
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
    choices: [{name: 'rc', message: 'Separate Files'}, {name: 'package'}],
    initial: ['rc'],
  },
];

const init = (answers) => {
  console.log(answers);

  // .eslintrc
  answers.to === 'rc' ? to_rc(eslintrc(answers), '.eslintrc') : to_package(eslintrc(answers), 'eslint');

  // .prettierrc
  to_rc(prettierrc(answers), '.prettierrc');

  // src & dist
  srcCode(answers);

  // // testing
  // mocharc(answers);
  // jestrc(answers);

  // .jscpd
  jscpd(answers);

  // // depcruise(answers);

  // repository(answers);

  // // sortByKeys(package.dependencies);
  // package.devDependencies = sortByKeys(package.devDependencies);
  // package.scripts = sortByKeys(package.scripts);

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
