const {removeKeys} = require('./utils')

module.exports = (answers, package) => {
  if (answers.inspectors.includes('dependency-cruiser')) {
    package.scripts = Object.assign({}, package.scripts, {
      depcruise: `depcruise --config .dependency-cruiser.js ${answers.src}`,
    });

    console.clear();
    console.log('Proceding to configuring `dependency-cruiser`');
    const program = require('commander');
    program.init = true;
    const cli = require('dependency-cruiser/src/cli');
    cli([], program);
  } else {
    package.devDependencies = removeKeys(package.devDependencies, ['dependency-cruiser']);
  }
};
