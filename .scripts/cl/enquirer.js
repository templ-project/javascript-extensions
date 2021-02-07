const semver = require("semver");

const { Snippet } = require("enquirer");

const {
  LANG_COFFEE,
  LANG_FLOW,
  LANG_JS,
  LANG_REASON,
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
} = require("./const");

const projectPrompt = new Snippet({
  name: "username",
  message: "Fill out the fields in package.json",
  required: true,
  fields: [
    {
      name: "author_name",
      message: "Author Name",
    },
    {
      name: "version",
      validate(value, state, item, index) {
        if (item && item.name === "version" && !semver.valid(value)) {
          return prompt.styles.danger("version should be a valid semver value");
        }
        return true;
      },
    },
  ],
  template: `{
  "name": "\${name}",
  "description": "\${description}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "\${username}/\${name}",
  "license": "\${license:ISC}"
}`,
});

const languageQuestions = [
  {
    type: "select",
    name: "language",
    message: "Setup your project. Choose JavaScript Flavor",
    choices: [
      {
        hint: "https://262.ecma-international.org/",
        message: "ECMAScript 6+ (using Babel)",
        name: LANG_JS,
      },
      {
        hint: "https://www.typescriptlang.org/",
        message: "TypeScript",
        name: LANG_TS,
      },
      {
        hint: "https://flow.org/en/",
        message: "ECMAScript 6+ with Flow (using Babel)",
        name: LANG_FLOW,
      },
      {
        hint: "https://coffeescript.org/",
        message: "CoffeeScript",
        name: LANG_COFFEE,
      },
      {
        disabled: true,
        hint: "https://reasonml.github.io/",
        message: "Reason",
        name: LANG_REASON,
      },
      {
        disabled: true,
        hint: "https://262.ecma-international.org/5.1/",
        message: "ECMAScript 5 (deprecated)",
        name: LANG_JS,
      },
    ],
  },
  {
    type: "select",
    name: "lintRules",
    message: "Choose Linting Rules",
    choices: [
      { name: LINT_AIRBNB, label: "Airbnb" },
      { name: LINT_ESLINT, label: "ESLint Recommended" },
    ],
    initial: LINT_ESLINT,
  },
  {
    type: "select",
    name: "testing",
    message: "Choose Testing Framework",
    choices: [{ name: TEST_JASMINE, disabled: true }, TEST_JEST, TEST_MOCHA],
    initial: TEST_MOCHA,
  },
  {
    type: "multiselect",
    name: "inspectors",
    message: "Choose Code Inspectors",
    choices: ["jscpd", "dependency-cruiser"],
    initial: ["jscpd"],
  },
  {
    type: "select",
    name: "repository",
    message: "Choose Git Repository Manager",
    choices: [
      { name: REPO_BIT, disabled: true },
      { name: REPO_GITEA, disabled: true },
      { name: REPO_GITEE, disabled: true },
      REPO_GITHUB,
      REPO_GITLAB,
    ],
    initial: [REPO_GITHUB],
  },
  {
    type: "select",
    name: "src",
    message: "Choose Src Folder",
    choices: [SRC_APP, SRC_SRC],
    initial: SRC_SRC,
  },
  {
    type: "select",
    name: "dist",
    message: "Choose Dist Folder",
    choices: [DIST_DIST, DIST_LIB],
    initial: DIST_DIST,
  },
];

module.exports = {
  projectPrompt,
  languageQuestions,
};
