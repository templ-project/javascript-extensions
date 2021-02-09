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
const getVersion = async (module) => fetch(`https://api.npms.io/v2/package/${encodeURI(module)}`)
  .then(res => res.json())
  .then(res => res.collected || {})
  .then(res => res.error ? '' : res.collected.metadata.version);

  const getVersions = async (modules) => fetch(`https://api.npms.io/v2/package/mget`, {
    method: 'post',
    body:    JSON.stringify(modules),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then(res => res.json())
  .then(modules => Object.keys(modules).reduce((acc, moduleName) => {
    acc[moduleName] = modules[moduleName].error ? '' : modules[moduleName].collected.metadata.version
    return acc
  }, {}))

const syncPackage = async (package) => {
  let dependencies = {...sortByKeys(package.newDependencies || {})};
  let devDependencies = {...sortByKeys(package.newDevDependencies || {})};

  let moduleNames = Object.keys(dependencies).filter(key => !dependencies[key])
  let withVersions = moduleNames.length > 0 ? await getVersions(moduleNames) : {}

  package.dependencies = sortByKeys({
    ...(package.dependencies || {}),
    ...dependencies,
    ...withVersions,
  });

  moduleNames = Object.keys(devDependencies).filter(key => !devDependencies[key])
  withVersions = moduleNames.length > 0 ? await getVersions(moduleNames) : {}

  package.devDependencies = sortByKeys({
    ...(package.devDependencies || {}),
    ...devDependencies,
    ...withVersions,
  });

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
