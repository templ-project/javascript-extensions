const fs = require('fs');
const path = require('path');
const {LANG_COFFEE, LANG_FLOW, LANG_TS, TEST_JEST} = require('./const');
const {to_rc, to_package} = require('./to');

const testCode = (answers) => {
  fs.mkdirSync('test', {recursive: true});

  let template = `
// import {expect} from 'jest';
import {hello} from '../src';
`;
  let ext = 'js';

  switch (answers.language) {
    case LANG_COFFEE:
      // https://code.tutsplus.com/tutorials/better-coffeescript-testing-with-mocha--net-24696
      ext = 'coffee';
      template = `
{describe, expect, it} = require 'jest'
{hello} = require '../src'

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
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    transform: {},
    testEnvironment: 'node',
  };

  let ext = 'js';
  switch (answers.language) {
    case LANG_COFFEE:
      ext = 'coffee';
      // template.require.unshift('coffeescript/register');
      break;
    case LANG_TS:
      ext = 'ts';
      template.transform["^.+\\.(t|j)s$"] = "ts-jest"
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
