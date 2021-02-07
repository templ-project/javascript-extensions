const fs = require("fs");
const fse = require("fs-extra");
const npm = require('npm');

const twig = require('./twig');
const { removeKeys, sortByKeys } = require("./utils");

const withVersion = (strings, dependency, version) => {
  version = version.length > 0 ? `@${version}` : ''
  return `${dependency}${version}`
}

const install = async (dependencies) => {
  try {
    return npm.commands.install(dependencies, (er, data) => {
      if (er) {
        console.log(dependencies)
        console.error(er)
        process.exit(1)
      }

      console.log(data)
    });
  } catch (e) {
    console.log(dependencies)
    console.error(e)
    process.exit(1)
  }
}

const syncPackage = async (package) => {
  const dependencies = {...sortByKeys(package.newDependencies || {})};
  const devDependencies = {...sortByKeys(package.newDevDependencies || {})};

  package.dependencies = {...sortByKeys(package.dependencies || {})};
  package.devDependencies = {...sortByKeys(package.devDependencies || {})};
  package.peerDependencies = {...sortByKeys(package.peerDependencies || {})};

  package.scripts = sortByKeys(package.scripts || {});


  package.husky = {
    hooks: {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "npm run git-hook:pre-commit"
    }
  }

  const rendered = await twig("./.scripts/cl/twig/package.json.twig", {
    package,
  });
  try {
    await fs.remove("./package.json");
    await fs.remove("./package-lock.json");
  } catch (e) {}
  await fs.promises.writeFile("./package.json", rendered);

  await npm.load(async (er) => {
    if (er) {
      console.error(er)
      process.exit(1)
    }

    npm.on("log", function (message) {
      // log the progress of the installation
      // console.log(message);
    });

    // fse.removeSync('node_modules')

    // for (const dependency of Object.keys(dependencies)) {
    //   await install([withVersion`${dependency}${dependencies[dependency]}`])
    // }

    npm.config.set('include', 'dev')
    for (const dependency of Object.keys(devDependencies)) {
      await install([withVersion`${dependency}${devDependencies[dependency]}`])
    }
    npm.config.set('include', '')
  });


}

module.exports = syncPackage
