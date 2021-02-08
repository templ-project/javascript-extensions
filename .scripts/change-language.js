const fs = require("fs");
const fse = require("fs-extra");
const npm = require("npm");

const { prompt } = require("enquirer");
const path = require("path");
const rimraf = require("rimraf");

const { LANG_TS, LINT_ESLINT, REPO_GITLAB, TEST_MOCHA, LANG_COFFEE } = require("./cl/const");
const depcruise = require("./cl/depcruise");
const { languageQuestions, projectPrompt } = require("./cl/enquirer");
const eslintrc = require("./cl/eslintrc");
const jestrc = require("./cl/jestrc");
const jscpd = require("./cl/jscpd");
const languagerc = require("./cl/languagerc");
const logger = require('./cl/logger')
const mocharc = require("./cl/mocharc");
const syncPackage = require("./cl/package");
const prettierrc = require("./cl/prettierrc");
const rollup = require("./cl/rollup");
const srcCode = require("./cl/src-code");
const { removeKeys, sortByKeys } = require("./cl/utils");

const args = process.argv.slice(2);
const noUnlink =
  args.filter((item) => item.toLowerCase() === "--no-unlink").length != 0;

const language = process.argv[2];

let package = JSON.parse(fs.readFileSync("./package.json").toString());

/****************************************************************************
 * Methods
 ****************************************************************************/

const repository = (answers) => {
  repositories = {
    bitbucket: "",
    gitea: ".github",
    gitee: "",
    github: ".github",
    gitlab: ".gitlab",
  };
  Object.getOwnPropertyNames(repositories)
    .filter(
      (item) =>
        repositories[item] !== repositories[answers.repository] &&
        repositories[item].length
    )
    .forEach((item) => rimraf.sync(repositories[item]));
};

/****************************************************************************
 * Settings
 ****************************************************************************/

if (process.env.TEMPLATE_ANSWERS) {
  setupProject(JSON.parse(process.env.TEMPLATE_ANSWERS));
  // setupProject({
  //   // language: LANG_COFFEE,
  //   // language: LANG_FLOW,
  //   // language: LANG_JS,
  //   // language: LANG_TS,
  //   lintRules: LINT_ESLINT,
  //   // lintRules: LINT_AIRBNB,
  //   // testing: TEST_MOCHA,
  //   testing: TEST_JEST,
  //   // inspectors: ['jscpd', 'dependency-cruiser'],
  //   // repository: 'github',
  //   // src: 'src',
  //   // dist: 'dist',
  //   // to: 'rc'
  // })
} else {
  init();
}

async function init() {
  console.clear();
  // await initProject();

  console.clear();
  await initLanguageSettings();
}

async function initProject() {
  await projectPrompt
    .run()
    .then((answers) => {
      package = {
        ...package,
        ...JSON.parse(answers.result),
      };
      console.log(package);
    })
    .catch(console.error);
}

async function initLanguageSettings() {
  await prompt(languageQuestions)
    .then((answers) => setupProject(answers))
    .catch(console.error);
}

async function setupProject(answers) {
  answers = {
    language: LANG_TS,
    lintRules: LINT_ESLINT,
    testing: TEST_MOCHA,
    inspectors: [],
    repository: "github",
    src: "src",
    dist: "dist",
    ...answers,
  };

  if (answers.language === LANG_COFFEE) {
    // dependency for prettier
    await npm.load(async (er) => {
      if (er) {
        console.error(er)
        process.exit(1)
      }
      await syncPackage.install(['prettier@github:helixbass/prettier#prettier-v2.1.0-dev.100-gitpkg'])
    })
  }
  await languagerc(answers, package);

  await rollup(answers, package);

  // .eslintrc
  await eslintrc(answers, package);

  // .prettierrc
  await prettierrc(answers, package);

  // src & test
  await srcCode(answers);

  // testing - mocha
  await mocharc(answers, package);

  // testing - jest
  await jestrc(answers, package);

  // .jsc
  await jscpd(answers, package);

  // .dependency-cruise.js
  depcruise(answers, package);

  if (answers.repository === REPO_GITLAB) {
    fse.removeSync("./.github");
  } else {
    fse.removeSync("./.gitlab");
  }

  syncPackage(package)

  if (syncPackage.epermDependencies.length > 0) {
    logger.warn(`We're not sure we installed the following packages: '${syncPackage.epermDependencies.join("', ")}'.`)
    logger.warn(`Please run 'npm i ${syncPackage.epermDependencies.join(" ")}' to make sure everything is OK. `)
  }

  if (!process.env.DEBUG) {
    rimraf.sync(".scripts/change-language.js");
    rimraf.sync(".scripts/cl");
    rimraf.sync(".scripts/travis-test.sh");
    rimraf.sync("javascript.svg");
    rimraf.sync("typescript.svg");
  }
}
