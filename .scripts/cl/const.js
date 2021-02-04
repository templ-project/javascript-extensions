
const DIST_DIST = 'dist'
const DIST_LIB = 'lib'

const LANG_COFFEE = 'coffee';
const LANG_FLOW = 'flow';
const LANG_JS = 'javascript';
const LANG_TS = 'typescript';

const LINT_ESLINT = 'eslint';
const LINT_AIRBNB = 'airbnb';

const REPO_BIT = 'bitbucket'
const REPO_GITEA = 'gitea'
const REPO_GITEE = 'gitee'
const REPO_GITHUB = 'github'
const REPO_GITLAB = 'gitlab'

const TEST_JASMINE = 'jasmine';
const TEST_JEST = 'jest';
const TEST_MOCHA = 'mocha';

const SRC_APP = 'app'
const SRC_SRC = 'src'

module.exports = {
  DIST_DIST,
  DIST_LIB,

  LANG_COFFEE,
  LANG_FLOW,
  LANG_JS,
  LANG_TS,

  LANGS: {
    LANG_COFFEE,
    LANG_FLOW,
    LANG_JS,
    LANG_TS
  },

  REPO_BIT,
  REPO_GITEA,
  REPO_GITEE,
  REPO_GITHUB,
  REPO_GITLAB,

  LINT_AIRBNB,
  LINT_ESLINT,

  LINTS: {
    LINT_AIRBNB,
    LINT_ESLINT,
  },

  SRC_APP,
  SRC_SRC,

  TEST_JASMINE,
  TEST_JEST,
  TEST_MOCHA,

  TESTS: {
    TEST_JASMINE,
    TEST_JEST,
    TEST_MOCHA,
  }
};
