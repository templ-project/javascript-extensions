const {LANG_COFFEE, LANG_FLOW, LANG_JS, LANG_TS} = require('./const');
const fs = require('fs');


module.exports = (answers, package) => {
  [LANG_COFFEE, LANG_FLOW, LANG_JS, LANG_TS]
    .filter(l => l !== answers.language)
    .forEach(l => fs.unlinkSync(`rollup.${l}.js`))

  fs.moveSync(`rollup.${answers.language}.js`, 'rollup.config.js')

  if (answers.language === LANG_COFFEE) {
    package.devDependencies = Object.assign({}, package.devDependencies, {
      // https://www.npmjs.com/package/@zeekay/rollup-plugin-coffee
      'rollup-plugin-coffee-script': '2.0.0',
      "@rollup/plugin-babel": "^5.0.2",
    })
  }

  if (answers.language === LANG_FLOW) {
    package.devDependencies = Object.assign({}, package.devDependencies, {
      // https://www.npmjs.com/package/@rollup/plugin-sucrase
      'rollup-plugin-flow': '1.1.1',
      "@rollup/plugin-babel": "^5.0.2",
    })
  }

  if (answers.language === LANG_JS) {
    package.devDependencies = Object.assign({}, package.devDependencies, {
      "@rollup/plugin-babel": "^5.0.2",
    })
  }

  if (answers.language === LANG_TS) {
    package.devDependencies = Object.assign({}, package.devDependencies, {
      "rollup-plugin-dts": "^1.4.7",
      "rollup-plugin-typescript2": "^0.27.1",
    })
  }

}
