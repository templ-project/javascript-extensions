const fs = require('fs');
const fse = require('fs-extra');

const {LANGS, LANG_COFFEE, LANG_FLOW, LANG_TS, LINTS, LINT_ESLINT, LINT_AIRBNB, TEST_MOCHA, TEST_JEST} = require('./const');
const twig = require('./twig');

const testCode = async (answers) => {
  fse.removeSync('test');

  let ext = 'js';
  switch (answers.language) {
    case LANG_COFFEE:
      ext = 'coffee';
      break;
    case LANG_TS:
      ext = 'ts';
      break;
    default:
  }

  fs.mkdirSync('test', {recursive: true});

  const options = {
    answers,
    LANGS,
    LINTS,
  }

  if (answers.language === LANG_TS) {
    const rendered = await twig('./.scripts/cl/twig/.mocharc.tsconfig.json.twig', options)
    await fs.promises.writeFile(`./test/tsconfig.json`, rendered
  )}

  const rendered = await twig('./.scripts/cl/twig/.mocharc.test.code.twig', options)
  return fs.promises.writeFile(`./test/index.test.${ext}`, rendered)


};

const mocharc = async (answers, package) => {
  if (answers.testing !== TEST_MOCHA) {
    return;
  }
  await testCode(answers);

  options = {
    answers,
    mocha: {
      require: [
        'chai/register-assert', // Using Assert style
        'chai/register-expect', // Using Expect style
        'chai/register-should', // Using Should style
      ]
    },
    LANGS,
    LINTS,
  }

  let ext = 'js';
  switch (answers.language) {
    case LANG_COFFEE:
      ext = 'coffee';
      options.mocha.require = [
        'coffeescript/register',
        ...options.mocha.require,
      ];
      break;
    case LANG_TS:
      ext = 'ts';
      options.mocha.require = [
        'ts-node/register',
        ...options.mocha.require,
      ];
      break;
    case LANG_FLOW:
    default:
      options.mocha.require = [
        '@babel/register',
        ...options.mocha.require,
      ];

      package.newDevDependencies = {
        ...(package.newDevDependencies || {}),
        '@babel/register': '',
      };
  }

  package.newDevDependencies = {
    ...(package.newDevDependencies || {}),
    chai: '',
    'eslint-plugin-mocha': '',
    mocha: '',
    'mocha-junit-reporter': '',
  };

  if (answers.language === LANG_TS) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      '@types/chai': '',
      '@types/mocha': '',
    };
  }

  package.scripts = {
    ...(package.scripts || {}),
    test: `npm run test:single -- './test/**/*.test.${ext}'`,
    'test:single': `cross-env NODE_ENV=test nyc --reporter=html --reporter=lcov --reporter=text --extension .${ext} mocha --forbid-only`,
  };

  const rendered = await twig('./.scripts/cl/twig/.mocharc.js.twig', options)

  try {
    await fs.promises.unlink('./.mocharc.js');
  } catch (e) {}
  return fs.promises.writeFile(`./.mocharc.js`, rendered)
};

module.exports = mocharc;
