const fs = require('fs');
const {LANG_COFFEE, LANG_FLOW, LANG_TS} = require('./const');
const twig = require('./twig');

const languagerc = async (answers, package) => {
  if (answers.language === LANG_COFFEE) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      coffeescript: 'latest',
    };
  } else if (answers.language === LANG_TS) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      '@types/node': '',
      '@typescript-eslint/eslint-plugin': '',
      '@typescript-eslint/parser': '',
      'rollup-plugin-dts': '',
      'rollup-plugin-typescript2': '',
      'ts-node': '',
      typedoc: '',
      typescript: '',
    };

    package.scripts = {
      ...(package.scripts || {}),
      docs: 'npx typedoc --out docs --json docs.json --readme none --theme minimal --mode file src',
    };

    const rendered = await twig('./.scripts/cl/twig/tsconfig.json.twig', {
      answers,
    })
    try {
      await fs.promises.unlink('./tsconfig.json');
    } catch (e) {}
    return fs.promises.writeFile('./tsconfig.json', rendered)
  } else {
    const babel = {
      plugins: [],
      presets: ['@babel/preset-env'],
    };

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      '@babel/cli': '',
      '@babel/core': '',
      '@babel/node': '',
      '@babel/preset-env': '',
      '@babel/register': '',
      '@rollup/plugin-babel': '',
      'babel-eslint': '',
      documentation: '',
    };

    package.scripts = {
      ...(package.scripts || {}),
      docs: 'documentation build src/** -f html -o docs; documentation build src/** -f json -o docs.json',
      // esdocs: "esdoc; documentation build src/** -f json -o docs.json",
    };

    // if (answers.language === LANG_FLOW) {
    //   babel.plugins =
    //   [...babel.plugins, '@babel/plugin-transform-flow-strip-types'];

    //   package.newDevDependencies = {
    //     ...(package.newDevDependencies || {}),
    //     '@babel/plugin-transform-flow-strip-types': '',
    //   };
    // }

    const rendered = await twig('./.scripts/cl/twig/.babelrc.js.twig', {
      answers,
    })
    try {
      await fs.promises.unlink('./.babelrc.js');
    } catch (e) {}
    return fs.promises.writeFile('./.babelrc.js', rendered)
  }
};

module.exports = languagerc;
