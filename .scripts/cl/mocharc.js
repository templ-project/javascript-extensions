const { LANG_COFFEE, LANG_FLOW, LANG_TS, TEST_MOCHA } = require('./const');
const { to_rc, to_package } = require('./to');

const mocharc = (answers, package) => {
  if (!answers.testing === TEST_MOCHA) {
    return;
  }
  const template = {
    recursive: true,
    reporter: 'spec',
    timeout: 5000,
    require: [
      'chai/register-assert', // Using Assert style
      'chai/register-expect', // Using Expect style
      'chai/register-should', // Using Should style
    ],
  };

  let ext = 'js';
  switch (answers.language) {
    case LANG_COFFEE:
      ext = 'coffee';
      template.require.unshift('coffeescript/register');
      break;
    case LANG_TS:
      ext = 'ts';
      template.require.unshift('ts-node/register');
      break;
    case LANG_FLOW:
    default:
      template.require.unshift('@babel/register');
      package.devDependencies = Object.assign({}, package.devDependencies, {
        '@babel/register': '^7.12.1',
      });
  }

  answers.to === 'rc'
    ? to_rc(template, '.mocharc')
    : to_package(template, package, 'mocha');

  package.devDependencies = Object.assign({}, package.devDependencies, {
    chai: '^4.2.0',
    'eslint-plugin-mocha': '^7.0.1',
    mocha: '^8.0.1',
    'mocha-junit-reporter': '^2.0.0',
  });

  if (answers.language === LANG_TS) {
    package.devDependencies = Object.assign({}, package.devDependencies, {
      '@types/chai': '^4.2.11',
      '@types/mocha': '^7.0.2',
    });
  }

  package.scripts = Object.assign({}, package.scripts, {
    test: `npm run test:single -- './test/**/*.test.${ext}'`,
    'test:single': `nyc --reporter=html --reporter=lcov --reporter=text --extension .${ext} mocha --forbid-only`,
  });
};

module.exports = mocharc;
