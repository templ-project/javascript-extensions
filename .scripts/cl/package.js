const fs = require("fs");
const fse = require("fs-extra");
// const npm = require('npm');
const fetch = require('node-fetch');

const logger = require('./logger')
const twig = require('./twig');
const { removeKeys, sortByKeys } = require("./utils");

// const withVersion = (strings, dependency, version) => {
//   version = version.length > 0 ? `@${version}` : ''
//   return `${dependency}${version}`
// }

// let epermDependencies = []

// const errHandler = (er, dependencies) => {
//   if (er) {
//     if (['EPERM', 'ENOTEMPTY'].includes(er.code)) {
//       epermDependencies = [
//         ...epermDependencies,
//         ...dependencies,
//       ]
//     } else {
//       console.error(er)
//       process.exit(1)
//     }
//   }
// }

// const install = async (dependencies) => {
//   if (!dependencies || !dependencies.length > 0) {
//     return
//   }
//   try {
//     return npm.commands.install(dependencies, (er, data) => {
//       errHandler(er, dependencies)
//       // console.log(data)
//     });
//   } catch (er) {
//     errHandler(er)
//   }
// }

// https://api-docs.npms.io/#api-Package
const getVersion = async (module) => fetch(`https://api.npms.io/v2/package/${module}`)
  .then(res => res.json())
  .then(res => res.collected || {})
  .then(res => res.metadata || {})
  .then(res => res.version);

const syncPackage = async (package) => {
  const dependencies = {...sortByKeys(package.newDependencies || {})};
  const devDependencies = {...sortByKeys(package.newDevDependencies || {})};

  for (const module of Object.keys(devDependencies)) {
    if (devDependencies[module]) {
      continue;
    }
    console.log(module)
    const version = await getVersion(module)
    console.log(version)
    process.exit(0)
  }

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

  // await npm.load(async (er) => {
  //   if (er) {
  //     console.error(er)
  //     process.exit(1)
  //   }

  //   npm.on("log", function (message) {
  //     // log the progress of the installation
  //     // console.log(message);
  //   });

  //   for (const dependency of Object.keys(dependencies)) {
  //     await install([withVersion`${dependency}${dependencies[dependency]}`])
  //   }

  //   npm.config.set('include', 'dev')
  //   for (const dependency of Object.keys(devDependencies)) {
  //     await install([withVersion`${dependency}${devDependencies[dependency]}`])
  //   }
  //   npm.config.set('include', '')
  // });


}

// module.exports = Object.assign(syncPackage, { install, epermDependencies })
module.exports = Object.assign(syncPackage)
