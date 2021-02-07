const fs = require('fs');
const {LANG_COFFEE, LANG_FLOW, LANG_JS, LANG_TS} = require('./const');
const twig = require('./twig');

module.exports = async (answers, package) => {
  if (!answers.inspectors.includes('jscpd')) {
    return;
  }

  package.newDevDependencies = {
    ...(package.newDevDependencies || {}),
    jscpd: 'latest',
    // 'jscpd-badge-reporter': '?',
  };

  package.scripts = {
    ...(package.scripts || {}),
    jscpd: `jscpd ./${answers.src} --blame --format ${
      answers.language !== LANG_FLOW ? (answers.language === LANG_COFFEE ? 'coffeescript' : answers.language) : LANG_JS
    }`,
    'jscpd:html': 'npm run jscpd -- --reporters html',
  };

  const rendered = await twig('./.scripts/cl/twig/.jscpd.json.twig', options)

  try {
    await fs.promises.unlink('./.jscpd.json');
  } catch (e) {}
  return fs.promises.writeFile('./.jscpd.json', rendered)
};
