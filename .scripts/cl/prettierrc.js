const fs = require('fs');

const {LANGS, TEST_MOCHA, TEST_JEST} = require('./const');
const twig = require('./twig');

const prettierrc = async (answers, package) => {

  const options = {
    answers,
    prettier: {
      parser: 'babel'
    },
    LANGS
  }

  let ext = '{js,jsx}';
  if (answers.language === LANGS.LANG_COFFEE) {
    ext = 'coffee';

    options.prettier.parser = 'coffeescript';

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      'prettier-plugin-coffeescript': '',
      prettier: 'github:helixbass/prettier#prettier-v2.1.0-dev.100-gitpkg',
    };
  }

  if (answers.language === LANGS.LANG_FLOW) {
    options.prettier.parser = 'flow';

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
    };
  }

  if (answers.language === LANGS.LANG_TS) {
    ext = '{ts,tsx}';

    options.prettier.parser = 'typescript';
  }

  if (answers.language !== LANGS.LANG_COFFEE) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      "prettier-plugin-import-sort": "",
      "import-sort-style-module": "",
    }

    package.importSort = {
      ...(package.importSort || {}),
      '.js, .jsx, .ts, .tsx': {
        parser: answers.language === LANGS.LANG_TS ? 'typescript' : 'babylon',
        style: answers.language === LANGS.LANG_TS ? 'module' : 'eslint',
      }
    }
  }

  package.scripts = {
    ...(package.scripts || {}),
    prettier: `prettier ./{${answers.src},test}/**/*.${ext}`,
    'prettier:check': 'npm run prettier -- --list-different',
    'prettier:write': 'npm run prettier -- --write',
  };

  const rendered = await twig('./.scripts/cl/twig/.prettierrc.js.twig', options)

  try {
    await fs.promises.unlink('./.prettierrc.js');
  } catch (e) {}
  return fs.promises.writeFile('./.prettierrc.js', rendered)
};

module.exports = prettierrc;
