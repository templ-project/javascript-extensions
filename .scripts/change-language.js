const { prompt } = require("enquirer");
const fs = require("fs");
const path = require("path");

const package = JSON.parse(fs.readFileSync("./package.json").toString());

/****************************************************************************
 * Methods
 ****************************************************************************/

const to_rc = (obj, label = ".prettierrc") => {
  fs.writeFileSync(
    `${label}.js`,
    `// ${label}.js
module.exports = ${JSON.stringify(obj, null, 2)};`
  );
};

const to_package = (obj, label = "prettier") => {
  package[label] = obj;
  return package;
};

const srcCode = (answers) => {
  fs.mkdirSync(answers.src, { recursive: true })

  let template = ''
  let ext = 'js'
  switch (answers.language) {
    case 'coffee':
      ext = 'coffee'
    case 'typescript':
      ext = 'ts'
      template = 'export const hello = (name: string): string => `Hello ${name}!`;'
    case 'flow':
    default:
      template = 'export const hello = (name) => `Hello ${name}!`;'
  }
  fs.writeFileSync(path.join(answers.src, `index.${ext}`), template);
}

// const sortByKeys = (obj) => {
//   let keys = Object.getOwnPropertyNames(obj).sort();
//   const newObj = {};
//   for (key of keys) {
//     if (typeof obj[key] !== "object" && !Array.isArray(obj[key])) {
//       newObj[key] = obj[key];
//     } else {
//       newObj[key] = sortByKeys(obj[key]);
//     }
//   }
//   return newObj;
// };

// const removeKeys = (obj, keys) => {
//   const newObj = {};
//   const okeys = Object.getOwnPropertyNames(obj).filter((key) =>
//     keys.find((lkey) => lkey === key)
//   );
//   for (const okey of okeys) {
//     newObj[okey] = obj[okey];
//   }
//   return newObj;
// };

// const mocharc = (
//   alter = (tpl) => {
//     tpl.require.push("@babel/register");
//     return tpl;
//   }
// ) => {
//   const template = {
//     recursive: true,
//     reporter: "spec",
//     timeout: 5000,
//     require: [
//       "chai/register-assert", // Using Assert style
//       "chai/register-expect", // Using Expect style
//       "chai/register-should", // Using Should style
//     ],
//   };
//   return alter ? alter(template) : template;
// };

// const jestrc = (alter = (tpl) => tpl) => {
//   const template = {
//     moduleFileExtensions: ["js", "json", "ts"],
//     rootDir: "src",
//     testRegex: ".spec.ts$",
//     transform: {
//       "^.+\\.(t|j)s$": "ts-jest",
//     },
//     coverageDirectory: "../coverage",
//     testEnvironment: "node",
//   };
//   return alter ? alter(template) : template;
// };

// const eslintrc = (
//   alter = (tpl) =>
//     Object.assign({}, tpl, {
//       parserOptions: {
//         parser: "babel-eslint",
//         ecmaVersion: 2018,
//         sourceType: "module",
//       },
//     })
// ) => {
//   const template = {
//     env: {
//       browser: true,
//       es6: true,
//       node: true,
//       mocha: true,
//     },
//     extends: ["plugin:mocha/recommended", "eslint:recommended"],
//     plugins: ["mocha"],
//     root: true,
//     rules: {
//       "consistent-return": 2,
//       indent: [1, 2],
//       "no-else-return": 1,
//       semi: [1, "always"],
//       "space-unary-ops": 2,
//     },
//   };
//   return alter ? alter(template) : template;
// };

// const prettierrc = (alter = (tpl) => tpl) => {
//   const template = {
//     parser: "babel",
//     printWidth: 120,
//     semi: true,
//     singleQuote: true,
//     tabWidth: 2,
//     trailingComma: "all",
//     bracketSpacing: false,
//   };
//   return alter ? alter(template) : template;
// };

/****************************************************************************
 * Settings
 ****************************************************************************/

const questions = [
  {
    type: "select",
    name: "language",
    message: "Choose JavaScript Flavor",
    choices: [
      "javascript",
      "typescript",
      { name: "flow", disabled: true },
      { name: "coffee", disabled: true },
    ],
  },
  {
    type: "select",
    name: "src",
    message: "Choose Src Folder",
    choices: ["app", "src"],
    initial: "src",
  },
  {
    type: "select",
    name: "dist",
    message: "Choose Dist Folder",
    choices: ["dist", "lib"],
    initial: "dist",
  },
  {
    type: "select",
    name: "testing",
    message: "Choose Testing Framework",
    choices: [{ name: "jasmine", disabled: true }, "jest", "mocha"],
    initial: "mocha",
  },
  {
    type: "multiselect",
    name: "inspectors",
    message: "Choose Code Inspectors",
    choices: ["jscpd", "dependency-cruiser"],
    initial: ["jscpd"],
  },
  {
    type: "select",
    name: "repository",
    message: "Choose Git Repository Manager",
    choices: [
      { name: "bitbucket", disabled: true },
      { name: "gitea", disabled: true },
      { name: "gitee", disabled: true },
      "github",
      "gitlab",
    ],
    initial: ["github"],
  },
  {
    type: "select",
    name: "to",
    message: "Write configs to",
    choices: [{ name: "rc", message: "Separate Files" }, { name: "package" }],
    initial: ["rc"],
  },
];

// const configs = {
//   coffee: {
//     mocharc: mocharc((tpl) => {
//       tpl.require.push("coffee-script/register");
//       return tpl;
//     }),
//   },
//   flow: {
//     mocharc: mocharc(),
//   },
//   javascript: {
//     dependencies: {},
//     // dependencyCruiser: depcruise(),
//     devDependencies: {
//       "@babel/cli": "^7.8.4",
//       "@babel/core": "^7.9.6",
//       "@babel/node": "^7.8.7",
//       "@babel/preset-env": "^7.9.6",
//       "@babel/register": "^7.9.0",
//       "@rollup/plugin-babel": "^5.0.2",
//       "babel-eslint": "^10.1.0",
//       documentation: "^13.0.0",
//     },
//     ext: 'js',
//     eslintrc: eslintrc(),
//     index: `export const hello = (name) => \`Hello \${name}!\`;`,
//     jestrc: jestrc(),
//     mocharc: mocharc(),
//     prettierrc: prettierrc(),
//     scripts: {
//       docs:
//         "documentation build src/** -f html -o docs; documentation build src/** -f json -o docs.json",
//       prettier: "prettier ./{src,test}/**/*.{js,jsx}",
//       jscpd: "jscpd ./src --blame --format javascript",
//       lint: "eslint ./{src,test}/**/*.{js,jsx}",
//       test: "npm run test:single -- './test/**/*.test.js'",
//       "test:single":
//         "nyc --reporter=html --reporter=lcov --reporter=text --extension .js mocha --forbid-only",
//     },
//   },
//   typescript: {
//     dependencies: {},
//     devDependencies: {
//       "@types/node": "^13.13.4",
//       "@typescript-eslint/eslint-plugin": "^2.30.0",
//       "@typescript-eslint/parser": "^2.30.0",
//       "rollup-plugin-dts": "^1.4.7",
//       "rollup-plugin-typescript2": "^0.27.1",
//       "ts-node": "^8.10.1",
//       typedoc: "^0.17.7",
//       typescript: "^3.8.3",
//     },
//     eslintrc: eslintrc((tpl) => {
//       tpl.extends.push("plugin:@typescript-eslint/recommended");
//       tpl.parser = "@typescript-eslint/parser";
//       tpl.plugins.push("@typescript-eslint");
//       return tpl;
//     }),
//     ext: 'ts',
//     index: `export const hello = (name: string): string => \`Hello \${name}!\`;`,
//     jestrc: jestrc(),
//     mocharc: mocharc((tpl) => {
//       tpl.require.push("ts-node/register");
//       return tpl;
//     }),
//     prettierrc: prettierrc((tpl) => {
//       tpl.parser = "typescript";
//       return tpl;
//     }),
//     scripts: {
//       docs:
//         "npx typedoc --out docs --json docs.json --readme none --theme minimal --mode file src",
//       prettier: "prettier ./{src,test}/**/*.{ts,tsx}",
//       jscpd: "jscpd ./src --blame --format typescript",
//       lint: "eslint ./{src,test}/**/*.{ts,tsx}",
//       test: "npm run test:single -- 'test/**/*.test.ts'",
//       "test:single":
//         "nyc --reporter=html --reporter=lcov --reporter=text --extension .ts mocha --forbid-only",
//     },
//   },
// };

const init = (answers) => {
  srcCode(answers);


  // // let writer = null;

  // // // .eslintrc
  // // (answers.to === 'rc') ? to_rc(configs[answers.language].eslintrc, '.eslintrc') : to_package(configs[answers.language].eslintrc, 'eslint');

  // // // .prettierrc
  // // (answers.to === 'rc') ? to_rc(configs[answers.language].prettierrc, '.prettierrc') : to_package(configs[answers.language].prettierrc, 'prettier');

  // switch (answers.testing) {
  //   case "jasmine":
  //   case "jest":
  //     // .mocharc
  //     answers.to === "rc"
  //       ? to_rc(configs[answers.language].jestrc, "jest.config")
  //       : to_package(configs[answers.language].jestrc, "jest");
  //     package.devDependencies = Object.assign({}, package.devDependencies, {
  //       "eslint-plugin-jest": "^23.18.0",
  //       jest: "^26.1.0",
  //       "ts-jest": "^26.1.1",
  //       "ts-loader": "^8.0.0",
  //     });
  //     if (answers.language === "typescript") {
  //       package.devDependencies = Object.assign({}, package.devDependencies, {
  //         "@types/jest": "^26.0.4",
  //       });
  //     }
  //     break;
  //   default:
  //     // mocha
  //     // .mocharc
  //     answers.to === "rc"
  //       ? to_rc(configs[answers.language].mocharc, ".mocharc")
  //       : to_package(configs[answers.language].mocharc, "mocha");
  //     package.devDependencies = Object.assign({}, package.devDependencies, {
  //       "eslint-plugin-mocha": "^7.0.1",
  //       mocha: "^8.0.1",
  //       "mocha-junit-reporter": "^2.0.0",
  //     });
  //     if (answers.language === "typescript") {
  //       package.devDependencies = Object.assign({}, package.devDependencies, {
  //         "@types/chai": "^4.2.11",
  //         "@types/mocha": "^7.0.2",
  //       });
  //     }
  // }

  // // .jscpd
  // // if (answers.inspectors.includes('jscpd')) {
  // //   package.devDependencies = Object.assign({}, package.devDependencies, {
  // //     "jscpd": "^2.0.16",
  // //     "jscpd-badge-reporter": "^1.1.3",
  // //   })
  // //   to_rc(configs[answers.language].jscpd, '.jscpd');
  // // }

  // switch (answers.repository) {
  //   case 'bitbucket':
  //   case 'gitea':
  //   case 'gitee':
  //     break;
  //   case 'gitlab':
  //     rimraf.sync('.github');
  //     break;
  //   default: // github
  //     rimraf.sync('.gitlab');
  // }

  // package.dependencies = Object.assign(
  //   {},
  //   package.dependencies,
  //   configs[answers.language].dependencies
  // );
  // sortByKeys(package.dependencies);
  // package.devDependencies = Object.assign(
  //   {},
  //   package.devDependencies,
  //   configs[answers.language].devDependencies
  // );
  // sortByKeys(package.devDependencies);
  // removeKeys(package.devDependencies, ["enquirer"]);

  // package.scripts = Object.assign(
  //   {},
  //   package.scripts,
  //   configs[answers.language].scripts
  // );
  // sortByKeys(package.scripts);

  // // if (answers.inspectors.includes('dependency-cruiser')) {
  // //   console.clear();
  // //   console.log('Proceding to configuring `dependency-cruiser`');
  // //   const program = require("commander");
  // //   program.init = true;
  // //   const cli = require('dependency-cruiser/src/cli');
  // //   cli([], program);
  // // } else {
  // //   removeKeys(package.devDependencies, ['dependency-cruiser']);
  // // }

  // console.log(package);
  // // fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
};

console.clear();
prompt(questions)
  .then((answers) => init(answers))
  .catch(console.error);
