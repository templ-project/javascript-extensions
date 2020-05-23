const { copyFile, unlink, writeFile } = require("fs").promises;
const { readFileSync } = require("fs");

const package = JSON.parse(readFileSync("./package.json"));

const args = process.argv.slice(2);

const noUnlink =
  args.filter((item) => item.toLowerCase() === "--no-unlink").length != 0;

const language = process.argv[2];

const packages = {
  javascript: {},
  typescript: {},
};

const devPackages = {
  javascript: {
    "@babel/cli": "^7.8.4",
    "@babel/core": "^7.9.6",
    "@babel/node": "^7.8.7",
    "@babel/preset-env": "^7.9.6",
    "@babel/register": "^7.9.0",
    "babel-eslint": "^10.1.0",
    eslint: "^6.8.0",
    "eslint-plugin-mocha": "^6.3.0",
  },
  typescript: {
    "@types/chai": "^4.2.11",
    "@types/mocha": "^7.0.2",
    "@types/node": "^13.13.4",
    "@typescript-eslint/eslint-plugin": "^2.30.0",
    "@typescript-eslint/parser": "^2.30.0",
    "ts-node": "^8.10.1",
    typescript: "^3.8.3",
  },
};

const scripts = {
  javascript: {
    build: "echo",
    "git-hook:pre-commit":
      "npm run prettier:write && npm run lint:write && npm run jscpd && npm run test",
    prettier: "prettier '{src,test}/**/*.{js,jsx}'",
    jscpd: "jscpd ./src --blame --format javascript",
    lint: "eslint ./{src,test}/**/*.{js,jsx}",
    test: "nyc --extension .js mocha --forbid-only 'test/**/*.test.js'",
    "test:html":
      "nyc --reporter html --extension .js mocha --forbid-only 'test/**/*.test.js'",
    "test:junit":
      "nyc --reporter mocha-junit-reporter --reporter-options mochaFile=./coverage/coverage.xml --extension .js mocha --forbid-only 'test/**/*.test.js'",
  },
  typescript: {
    build: "echo",
    "git-hook:pre-commit":
      "npm run prettier:write && npm run lint:write && npm run jscpd && npm run test",
    prettier: "prettier '{src,test}/**/*.{ts,tsx}'",
    jscpd: "jscpd ./src --blame --format typescript",
    lint: "eslint ./{src,test}/**/*.{ts,tsx}",
    test: "nyc --extension .ts mocha --forbid-only 'test/**/*.test.ts'",
    "test:html":
      "nyc --reporter html --extension .js mocha --forbid-only 'test/**/*.test.ts'",
    "test:html":
      "nyc --reporter mocha-junit-reporter --reporter-options mochaFile=./coverage/coverage.xml --extension .js mocha --forbid-only 'test/**/*.test.ts'",
  },
};

const config = async () => {
  switch (language.toLowerCase()) {
    case "none":
      Object.getOwnPropertyNames(devPackages.javascript).forEach(
        (value, key) => {
          delete package.devPackages[key];
        }
      );
      Object.getOwnPropertyNames(devPackages.typescript).forEach(
        (value, key) => {
          delete package.devPackages[key];
        }
      );
      Object.getOwnPropertyNames(packages.javascript).forEach((value, key) => {
        delete package.packages[key];
      });
      Object.getOwnPropertyNames(packages.typescript).forEach((value, key) => {
        delete package.packages[key];
      });
      Object.getOwnPropertyNames(scripts.javascript).forEach((value, key) => {
        delete package.scripts[key];
      });
      Object.getOwnPropertyNames(scripts.typescript).forEach((value, key) => {
        delete package.scripts[key];
      });
      delete package.gitHooks["pre-commit"];
      break;
    case "javascript":
      package.devPackages = Object.assign(
        {},
        package.devPackages,
        devPackages.javascript
      );
      package.packages = Object.assign(
        {},
        package.packages,
        packages.javascript
      );
      package.scripts = Object.assign({}, package.scripts, scripts.javascript);
      package.gitHooks = Object.assign({}, package.gitHooks, {
        "pre-commit": "npm run git-hook:pre-commit && git add .",
      });
      await copyFile(".eslint.javascript.js", ".eslint.js");
      await copyFile(".mocharc.javascript.js", ".mocharc.js");
      await copyFile(".prettierrc.javascript.js", ".prettierrc.js");
      if (!noUnlink) {
        unlink(".babelrc.javascript.js");
        unlink(".eslint.javascript.js");
        unlink(".mocharc.javascript.js");
        unlink("tsconfig.json");
        unlink("test/tsconfig.json");
        delete package.scripts['change:language']
      }
      break;
    case "typescript":
      package.devPackages = Object.assign(
        {},
        package.devPackages,
        devPackages.typescript
      );
      package.packages = Object.assign(
        {},
        package.packages,
        packages.typescript
      );
      package.scripts = Object.assign({}, package.scripts, scripts.typescript);
      package.gitHooks = Object.assign({}, package.gitHooks, {
        "pre-commit": "npm run git-hook:pre-commit && git add .",
      });
      await copyFile(".eslint.typescript.js", ".eslint.js");
      await copyFile(".mocharc.typescript.js", ".mocharc.js");
      await copyFile(".prettierrc.typescript.js", ".prettierrc.js");
      if (!noUnlink) {
        unlink(".babelrc.js");
        unlink(".eslint.typescript.js");
        unlink(".mocharc.typescript.js");
        unlink(".prettierrc.typescript.js");
        delete package.scripts['change:language']
      }
      break;
    default:
      console.error(
        "No language selected. Please chose between: javascript and typescrypt"
      );
      process.exit(1);
  }

  writeFile("package.json", JSON.stringify(package, 4), "utf-8");
};

config();
