const fs = require("fs");
const npm = require('npm');

const twig = require('./twig');
const { removeKeys, sortByKeys } = require("./utils");

const syncPagkage = async (package) => {
  const dependencies = sortByKeys(package.dependencies || {});
  const devDependencies = sortByKeys(package.devDependencies || {});
  const peerDependencies = sortByKeys(package.peerDependencies || {});
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

  const rendered = await twig("./.scripts/cl/twig/package.json.twig", {
    package,
  });
  try {
    await fs.remove("./package.json");
    await fs.remove("./package-lock.json");
  } catch (e) {}
  await fs.promises.writeFile("./package.json", rendered);


  for (const dependency of Object.keys(dependencies)) {
    console.log(`Installing package: ${dependency}`)
    // await npm.commands.install([dependency], (er) => {
    //   if (er) {
    //     console.error(er)
    //     process.exit(1)
    //   }
    // })
  }


}




module.exports = syncPagkage
