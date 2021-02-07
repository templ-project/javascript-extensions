const fs = require('fs');

const {LANGS} = require('./const');
const twig = require('./twig');


module.exports = async (answers, package) => {

  let ext = 'js'

  let plugins = ['bab()']

  if (answers.language === LANGS.LANG_COFFEE) {
    ext = 'coffee';

    plugins = [
      'coffee(coffeeOptions)',
      ...plugins
    ]

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      // https://www.npmjs.com/package/@zeekay/rollup-plugin-coffee
      'rollup-plugin-coffee-script': '?',
      "@rollup/plugin-babel": "?",
    }
  }

  if (answers.language === LANGS.LANG_FLOW) {

    plugins = [
      'flow()',
      ...plugins
    ]

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      // https://www.npmjs.com/package/@rollup/plugin-sucrase
      'rollup-plugin-flow': '?',
      "@rollup/plugin-babel": "?",
    }
  }

  if (answers.language === LANGS.LANG_JS) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      "@rollup/plugin-babel": "?",
    }
  }

  if (answers.language === LANGS.LANG_TS) {
    ext = 'ts';

    plugins = ['ts()']

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      "rollup-plugin-dts": "?",
      "rollup-plugin-typescript2": "?",
    }
  }

  const rendered = await twig('./.scripts/cl/twig/rollup.config.js.twig', {
    answers,
    ext,
    plugins,
    LANGS,
  })

  try {
    await fs.promises.unlink('./rollup.config.js');
  } catch (e) {}
  return fs.promises.writeFile('./rollup.config.js', rendered)
}
