const fs = require("fs");
const npm = require('npm');

const twig = require('./twig');
const { removeKeys, sortByKeys } = require("./utils");

const withVersion = (strings, dependency, version) => {
  // const dependency = strings[0];
  console.log(dependency, version)
  version = (version && version !== '?') ? `@${version}` : ''
  return `${dependency}${version}`
}

const install = async (dependencies) => {
  return npm.commands.install(dependencies, (er, data) => {
    if (er) {
      console.error(er)
      process.exit(1)
    }

    console.log(data)
  });
}

const syncPackage = async (package) => {
  const dependencies = {...sortByKeys(package.dependencies || {})};
  const devDependencies = {...sortByKeys(package.devDependencies || {})};
  const peerDependencies = {...sortByKeys(package.peerDependencies || {})};
  package.scripts = sortByKeys(package.scripts || {});

  package.dependencies = {}
  package.devDependencies = {}
  package.peerDependencies = {}

  package.husky = {
    hooks: {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "npm run git-hook:pre-commit"
    }
  }

  // const rendered = await twig("./.scripts/cl/twig/package.json.twig", {
  //   package,
  // });
  // try {
  //   await fs.remove("./package.json");
  //   await fs.remove("./package-lock.json");
  // } catch (e) {}
  // await fs.promises.writeFile("./package.json", rendered);

  await npm.load(async (er) => {
    if (er) {
      console.error(er)
      process.exit(1)
    }

    npm.on("log", function (message) {
      // log the progress of the installation
      console.log(message);
    });

    for (const dependency of Object.keys(dependencies)) {
      await install([withVersion`${dependency}${dependencies[dependency]}`])
    }

    npm.config.set('dev', true)
    for (const dependency of Object.keys(devDependencies)) {
      await install([withVersion`${dependency}${devDependencies[dependency]}`])
    }
    npm.config.set('dev', false)
  });


}

module.exports = syncPackage
