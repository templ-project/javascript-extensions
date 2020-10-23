const fs = require('fs');
const path = require('path');
const { LANG_COFFEE, LANG_FLOW, LANG_TS } = require('./const');

const testCode = (answers) => {
  fs.mkdirSync('test', { recursive: true });

  let template = `
import {expect} from 'chai';
import {it, describe} from 'mocha';

import {hello} from '../src';
`;
  let ext = 'js';

  switch (answers.language) {
    case LANG_COFFEE:
      // https://code.tutsplus.com/tutorials/better-coffeescript-testing-with-mocha--net-24696
      ext = 'coffee';
      template = `
{expect} = require 'chai'
{describe, it} = require 'mocha'
{hello} = require '../src'

describe "hello", ->
  it 'hello("World") to return "Hello World!"', ->
    expect(hello("World")).to.equal "Hello World!"
`;
      break;
    case LANG_TS:
      ext = 'ts';
    case LANG_FLOW:
    default:
      template += `
describe('hello', function () {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello('World')).to.equal('Hello World!');
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
        2
      )
    );
  }
};

module.exports = testCode;
