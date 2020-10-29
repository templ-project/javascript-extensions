const {LANG_COFFEE, LANG_FLOW, LANG_JS, LANG_TS, LINT_ESLINT, LINT_AIRBNB, TEST_MOCHA, TEST_JEST} = require('./const');
const fs = require('fs');


module.exports = (answers) => {
  [LANG_COFFEE, LANG_FLOW, LANG_JS, LANG_TS]
    .filter(l => l !== answers.language)
    .forEach(l => fs.unlinkSync(`rollup.${l}.js`))

  fs.moveSync(`rollup.${answers.language}.js`, 'rollup.config.js')


}
