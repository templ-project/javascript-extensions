const {prompt} = require('enquirer');
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
const mocharc = require('./cl/mocharc');
const jestrc = require('./cl/jestrc');
const eslintrc = require('./cl/eslintrc');
const prettierrc = require('./cl/prettierrc');
const rollup = require('./cl/rollup');
const jscpd = require('./cl/jscpd');
const depcruise = require('./cl/depcruise');
const {to_rc, to_package} = require('./cl/to');

const package = JSON.parse(fs.readFileSync('./package.json').toString());

/****************************************************************************
 * Methods
 ****************************************************************************/

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
  const okeys = Object.getOwnPropertyNames(obj).filter((key) => keys.find((lkey) => lkey === key));
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
    .filter((item) => repositories[item] !== repositories[answers.repository] && repositories[item].length)
    .forEach((item) => rimraf.sync(repositories[item]));
};

/****************************************************************************
 * Settings
 ****************************************************************************/

const questions = [
  {
    type: 'select',
    name: 'language',
    message: 'Choose JavaScript Flavor',
    choices: [LANG_JS, LANG_TS, LANG_FLOW, LANG_COFFEE],
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
    choices: [/*{name: 'jasmine', disabled: true},*/TEST_JEST, TEST_MOCHA],
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

  languagerc(answers, package);
  rollup(answers, package);

  // .eslintrc
  answers.to === 'rc' ? to_rc(eslintrc(answers, package), '.eslintrc') : to_package(eslintrc(answers, package), package, 'eslint');

  // .prettierrc
  to_rc(prettierrc(answers, package), '.prettierrc');

  // src & test
  srcCode(answers);

  // testing
  mocharc(answers, package);
  jestrc(answers, package);

  // .jscpd
  jscpd(answers, package);
  depcruise(answers, package);

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
