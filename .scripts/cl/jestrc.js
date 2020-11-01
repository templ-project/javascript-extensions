const fs = require('fs');
const path = require('path');
const {LANG_COFFEE, LANG_FLOW, LANG_TS, TEST_JEST} = require('./const');
const {to_rc, to_package} = require('./to');

const testCode = (answers) => {
  fs.mkdirSync('test', {recursive: true});

  let template = `
import {hello} from '../src';

`;
  let ext = 'js';

  switch (answers.language) {
    case LANG_COFFEE:
      // https://code.tutsplus.com/tutorials/better-coffeescript-testing-with-mocha--net-24696
      ext = 'coffee';
      template = `
{hello} = require '../${answers.src}'

describe "hello", ->
  it 'hello("World") to return "Hello World!"', ->
    expect(hello("World")).toEqual "Hello World!"
`;
      break;
    case LANG_TS:
      ext = 'ts';
    case LANG_FLOW:
    default:
      template += `
import {hello} from '../${answers.src}';

describe('hello', function () {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello('World')).toEqual('Hello World!');
  });
});
`;
  }
  fs.writeFileSync(path.join('test', `index.test.${ext}`), template);

  if (answers.language === LANG_TS) {
    fs.writeFileSync(
      path.join('test', `tsconfig.json`),
      JSON.stringify(
        {
          extends: '../tsconfig',
          compilerOptions: {
            noEmit: true,
          },
          references: [
            {
              path: '..',
            },
          ],
        },
        null,
        2,
      ),
    );
  }
};

const jestrc = (answers, package) => {
  if (answers.testing !== TEST_JEST) {
    return;
  }
  testCode(answers);

  const template = {
    clearMocks: true,
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['js', 'json', 'jsx'],
    // rootDir: '.',
    roots: [ "test" ],
    transform: {},
    testEnvironment: 'node',
  };

  let ext = 'js';
  switch (answers.language) {
    case LANG_COFFEE:
      ext = 'coffee';
      template.moduleFileExtensions.push('coffee')
      // template.roots = [ "test" ]
      template.moduleDirectories = [ 'node_modules', answers.src ]
      template.transform = {
        ".*": "<rootDir>/test/preprocessor.js"
      }

      fs.writeFileSync('./test/preprocessor.js', `
// preprocessor.js

const coffee = require('coffeescript');
const babelJest = require('babel-jest');

module.exports = {
  process: (src, path, config) => {
    if (!/node_modules/.test(path)) {
      // CoffeeScript files need to be compiled by CoffeeScript
      // before being processed by babel
      if (coffee.helpers.isCoffee(path)) {
        src = coffee.compile(src, { bare: true });
      }
      return babelJest.process(src, path, config);
    }
    return src;
  }
};

`);
      break;
    case LANG_TS:
      ext = 'ts';
      template.transform["^.+\\.(t|j)s$"] = "ts-jest"
      template.moduleFileExtensions.push('ts')
      template.moduleFileExtensions.push('tsx')
      package.devDependencies = Object.assign({}, package.devDependencies || {}, {
        'ts-jest': '^26.4.3',
      });
      break;
    case LANG_FLOW:
    default:
      template.transform["\\.[jt]sx?$"] = "babel-jest"
      // template.require.unshift('@babel/register');
      package.devDependencies = Object.assign({}, package.devDependencies || {}, {
        '@babel/register': '^7.12.1',
        'babel-jest': '^26.6.1',
      });
  }

  template.testRegex = `.test.${ext}$`
  answers.to === 'rc' ? to_rc(template, 'jest.config') : to_package(template, package, 'jest');

  package.devDependencies = Object.assign({}, package.devDependencies || {}, {
    jest: '^26.6.1',
    'eslint-plugin-jest': '^24.1.0',
  });

  if (answers.language === LANG_TS) {
    package.devDependencies = Object.assign({}, package.devDependencies || {}, {
      '@types/jest': '^26.0.15',
    });
  }

  package.scripts = Object.assign({}, package.scripts || {}, {
    test: 'cross-env NODE_ENV=test NO_API_DOC=1 jest --coverage --runInBand --verbose',
    'test:watch': 'npm run test -- --watch',
  });
};

module.exports = jestrc;
