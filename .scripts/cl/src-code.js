const fs = require('fs');
const path = require('path');
const { LANG_COFFEE, LANG_FLOW, LANG_TS } = require('./const');

const srcCode = (answers) => {
  fs.mkdirSync(answers.src, { recursive: true });

  let template = '';
  let ext = 'js';
  switch (answers.language) {
    case LANG_COFFEE:
      ext = 'coffee';
      template = `hello = (name) -> "Hello " + name + "!"

module.exports = {
  hello
}`;
      break;
    case LANG_TS:
      ext = 'ts';
      template =
        'export const hello = (name: string): string => `Hello ${name}!`;';
      break;
    case LANG_FLOW:
      template = `// @flow
export const hello = (name: string): string => \`Hello \${name}!\`;`;
      break;
    default:
      template = 'export const hello = (name) => `Hello ${name}!`;';
  }
  fs.writeFileSync(path.join(answers.src, `index.${ext}`), template);
};

module.exports = srcCode;
