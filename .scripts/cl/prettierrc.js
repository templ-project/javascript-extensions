const {LANG_COFFEE, LANG_FLOW, LANG_TS} = require('./const');

const prettierrc = (answers, package) => {
  const template = {
    parser: 'babel',
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    bracketSpacing: false,
  };
  let ext = '{js,jsx}';
  if (answers.language === LANG_COFFEE) {
    ext = 'coffee';
    template.parser = 'coffeescript';
    package.devDependencies = Object.assign({}, package.devDependencies, {
      'prettier-plugin-coffeescript': '^0.1.5',
    });
  }
  if (answers.language === LANG_FLOW) {
    template.parser = 'flow';
    package.devDependencies = Object.assign({}, package.devDependencies, {
      'flow-parser': '^0.136.0',
    });
  }
  if (answers.language === LANG_TS) {
    ext = '{ts,tsx}';
    template.parser = 'typescript';
  }
  package.scripts = Object.assign({}, package.scripts, {
    prettier: `prettier ./{${answers.src},test}/**/*.${ext}`,
    'prettier:check': 'npm run prettier -- --list-different',
    'prettier:write': 'npm run prettier -- --write',
  });
  return template;
};

module.exports = prettierrc;
