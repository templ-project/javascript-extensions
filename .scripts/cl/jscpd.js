const fs = require('fs');
const {LANG_COFFEE, LANG_FLOW, LANG_JS, LANG_TS} = require('./const');

module.exports = (answers, package) => {
  if (!answers.inspectors.includes('jscpd')) {
    return;
  }

  const template = {
    absolute: true,
    blame: true,
    ignore: ['**/__snapshots__/**', '**/*.min.js', '**/*.map'],
    output: '.jscpd',
    reporters: ['console', 'badge'],
    threshold: 0.1,
  };

  fs.writeFileSync('.jscpd.json', JSON.stringify(template, null, 2));

  package.devDependencies = Object.assign({}, package.devDependencies, {
    jscpd: '^2.0.16',
    'jscpd-badge-reporter': '^1.1.3',
  });
  package.scripts = Object.assign({}, package.scripts, {
    jscpd: `jscpd ./${answers.src} --blame --format ${
      answers.language !== LANG_FLOW ? (answers.language === LANG_COFFEE ? 'coffeescript' : answers.language) : LANG_JS
    }`,
    'jscpd:html': 'npm run jscpd -- --reporters html',
  });
};
