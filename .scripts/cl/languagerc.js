const fs = require('fs');
const {LANG_COFFEE, LANG_FLOW, LANG_TS} = require('./const');

const languagerc = (answers, package) => {
  if (answers.language === LANG_COFFEE) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      coffeescript: '^2.5.1 ',
    };
  } else if (answers.language === LANG_TS) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      '@types/node': '^13.13.4',
      '@typescript-eslint/eslint-plugin': '^2.30.0',
      '@typescript-eslint/parser': '^2.30.0',
      'rollup-plugin-dts': '^1.4.7',
      'rollup-plugin-typescript2': '^0.27.1',
      'ts-node': '^8.10.1',
      typedoc: '^0.17.7',
      typescript: '^3.8.3',
    };
    package.scripts = {
      ...(package.scripts || {}),
      docs: 'npx typedoc --out docs --json docs.json --readme none --theme minimal --mode file src',
    };
  } else {
    const template = {
      plugins: [],
      presets: ['@babel/preset-env'],
    };

    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      '@babel/cli': '^7.8.4',
      '@babel/core': '^7.9.6',
      '@babel/node': '^7.8.7',
      '@babel/preset-env': '^7.9.6',
      '@babel/register': '^7.9.0',
      '@rollup/plugin-babel': '^5.0.2',
      'babel-eslint': '^10.1.0',
      documentation: '^13.0.0',
    };

    package.scripts = {
      ...(package.scripts || {}),
      docs: 'documentation build src/** -f html -o docs; documentation build src/** -f json -o docs.json',
      // esdocs: "esdoc; documentation build src/** -f json -o docs.json",
    };

    if (answers.language === LANG_FLOW) {
      template.plugins.push('@babel/plugin-transform-flow-strip-types');

      package.newDevDependencies = {
        ...(package.newDevDependencies || {}),
        '@babel/plugin-transform-flow-strip-types': '7.12.1',
      };
    }

    fs.writeFileSync(
      `.babelrc.js`,
      `// .babelrc.js
module.exports = ${JSON.stringify(template, null, 2)};`,
    );
  }
};

module.exports = languagerc;
