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

    package.devDependencies = Object.assign({}, package.devDependencies, {
      // https://www.npmjs.com/package/@zeekay/rollup-plugin-coffee
      'rollup-plugin-coffee-script': '2.0.0',
      "@rollup/plugin-babel": "^5.0.2",
    })
  }

  if (answers.language === LANGS.LANG_FLOW) {

    plugins = [
      'flow()',
      ...plugins
    ]

    package.devDependencies = Object.assign({}, package.devDependencies, {
      // https://www.npmjs.com/package/@rollup/plugin-sucrase
      'rollup-plugin-flow': '1.1.1',
      "@rollup/plugin-babel": "^5.0.2",
    })
  }

  if (answers.language === LANGS.LANG_JS) {
    package.devDependencies = Object.assign({}, package.devDependencies, {
      "@rollup/plugin-babel": "^5.0.2",
    })
  }

  if (answers.language === LANGS.LANG_TS) {
    ext = 'ts';

    plugins = ['ts()']

    package.devDependencies = Object.assign({}, package.devDependencies, {
      "rollup-plugin-dts": "^1.4.7",
      "rollup-plugin-typescript2": "^0.27.1",
    })
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
