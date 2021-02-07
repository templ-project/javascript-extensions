const fs = require("fs");
const twig = require('./cl/twig');

export const syncPagkage = (package) => {
  package.dependencies = sortByKeys(package.dependencies || {});
  package.devDependencies = sortByKeys(package.devDependencies || {});
  package.peerDependencies = sortByKeys(package.peerDependencies || {});
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
}


module.exports = syncPagkage
