const fs = require('fs');

const {LANGS, TEST_MOCHA, TEST_JEST} = require('./const');
const twig = require('./twig');

const prettierrc = async (answers, package) => {

  const options = {
    answers,
    parser: 'babel',
    LANGS
  }

  let ext = '{js,jsx}';
  if (answers.language === LANGS.LANG_COFFEE) {
    ext = 'coffee';

    options.parser = 'coffeescript';

    package.devDependencies = Object.assign({}, package.devDependencies, {
      'prettier-plugin-coffeescript': '^0.1.5',
    });
  }

  if (answers.language === LANGS.LANG_FLOW) {
    options.parser = 'flow';

    package.devDependencies = Object.assign({}, package.devDependencies, {
      'flow-parser': '^0.136.0',
    });
  }

  if (answers.language === LANGS.LANG_TS) {
    ext = '{ts,tsx}';

    options.parser = 'typescript';
  }

  package.scripts = Object.assign({}, package.scripts, {
    prettier: `prettier ./{${answers.src},test}/**/*.${ext}`,
    'prettier:check': 'npm run prettier -- --list-different',
    'prettier:write': 'npm run prettier -- --write',
  });

  const rendered = await twig('./.scripts/cl/twig/.prettierrc.js.twig', options)

  try {
    await fs.promises.unlink('./.prettierrc.js');
  } catch (e) {}
  return fs.promises.writeFile('./.prettierrc.js', rendered)
};

module.exports = prettierrc;
