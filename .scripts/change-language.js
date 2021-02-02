const fs = require('fs');
const fse = require('fs-extra');

const {prompt} = require('enquirer');
const path = require('path')
const rimraf = require('rimraf');

const {
  LANG_COFFEE,
  LANG_FLOW,
  LANG_JS,
  LANG_TS,
  REPO_BIT,
  REPO_GITEA,
  REPO_GITEE,
  REPO_GITHUB,
  REPO_GITLAB,
  LINT_AIRBNB,
  LINT_ESLINT,
  TEST_JASMINE,
  TEST_JEST,
  TEST_MOCHA,
  SRC_APP,
  SRC_SRC,
  DIST_DIST,
  DIST_LIB,
} = require('./cl/const');
const depcruise = require('./cl/depcruise');
const eslintrc = require('./cl/eslintrc');
// const jestrc = require('./cl/jestrc');
const jscpd = require('./cl/jscpd');
const languagerc = require('./cl/languagerc');
const mocharc = require('./cl/mocharc');
const prettierrc = require('./cl/prettierrc');
const rollup = require('./cl/rollup');
const srcCode = require('./cl/src-code');
const {removeKeys, sortByKeys} = require('./cl/utils')

const args = process.argv.slice(2);
const noUnlink =
  args.filter((item) => item.toLowerCase() === "--no-unlink").length != 0;

const language = process.argv[2];

const package = JSON.parse(fs.readFileSync('./package.json').toString());




/****************************************************************************
 * Methods
 ****************************************************************************/

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
      {name: LINT_AIRBNB, label: 'Airbnb'},
      {name: LINT_ESLINT, label: 'ESLint Recommended'},
    ],
    initial: LINT_ESLINT,
  },
  {
    type: 'select',
    name: 'testing',
    message: 'Choose Testing Framework',
    choices: [{name: TEST_JASMINE, disabled: true}, TEST_JEST, TEST_MOCHA],
    initial: TEST_MOCHA,
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
      {name: REPO_BIT, disabled: true},
      {name: REPO_GITEA, disabled: true},
      {name: REPO_GITEE, disabled: true},
      REPO_GITHUB,
      REPO_GITLAB,
    ],
    initial: [REPO_GITHUB],
  },
  {
    type: 'select',
    name: 'src',
    message: 'Choose Src Folder',
    choices: [SRC_APP, SRC_SRC],
    initial: SRC_SRC,
  },
  {
    type: 'select',
    name: 'dist',
    message: 'Choose Dist Folder',
    choices: [DIST_DIST, DIST_LIB],
    initial: DIST_DIST,
  },
];

const init = async (answers) => {
  answers = {
    language: LANG_TS,
    lintRules: LINT_ESLINT,
    testing: TEST_MOCHA,
    inspectors: [],
    repository: 'github',
    src: 'src',
    dist: 'dist',
    ...answers,
  }

  languagerc(answers, package);

  await rollup(answers, package);

  // .eslintrc
  await eslintrc(answers, package);

  // .prettierrc
  await prettierrc(answers, package);

  // src & test
  await srcCode(answers)

  // testing
  await mocharc(answers, package);
  // TODO:
  // await jestrc(answers, package);

  // .jsc
  await jscpd(answers, package);

  // .dependency-cruise.js
  depcruise(answers, package);

  if (answers.repository === REPO_GITLAB) {
    fse.removeSync('./.github')
  } else {
    fse.removeSync('./.gitlab')
  }

  package.dependencies = sortByKeys(package.dependencies || {});
  package.devDependencies = sortByKeys(package.devDependencies || {});
  package.scripts = sortByKeys(package.scripts || {});

  fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
};

console.clear();

// init({
//   // language: LANG_COFFEE,
//   // language: LANG_FLOW,
//   // language: LANG_JS,
//   language: LANG_TS,
//   lintRules: LINT_ESLINT,
//   // lintRules: LINT_AIRBNB,
//   // testing: TEST_MOCHA,
//   inspectors: ['jscpd', 'dependency-cruiser'],
//   // repository: 'github',
//   // src: 'src',
//   // dist: 'dist',
//   // to: 'rc'
// })

if (process.env.TEMPLATE_ANSWERS) {
  init(JSON.parse(process.env.TEMPLATE_ANSWERS));
} else {
  prompt(questions)
    .then((answers) => init(answers))
    .catch(console.error);
}
