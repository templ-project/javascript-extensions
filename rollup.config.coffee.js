/**
 * If you're writing a multi package application, https://lerna.coffee.org/ should
 * be the solution for you.
 */

import coffee from 'rollup-plugin-coffee-script';
import babel from "@rollup/plugin-babel";

const isProduction = process.env.NODE_ENV === "production";

const entryName = "index";

const coffeeOptions = {transpile: {presets: ['@babel/env']}}

/**
 * Replace this with the name of your module
 */
const name = "javascript-template";

const bab = () =>
  babel({
    // cacheRoot: '.rollupcache',
    babelHelpers: "bundled",
  });

export default [
  {
    input: `src/${entryName}.coffee`,
    output: [
      {
        file: `dist/es2015/${entryName}.coffee`,
        format: "es",
      },
      {
        file: `dist/umd-es2015/${entryName}.coffee`,
        format: "umd",
        name: name,
      },
    ],
    plugins: [coffee(coffeeOptions), bab()],
  },
].concat(
  !isProduction
    ? []
    : [
        {
          input: `src/${entryName}.coffee`,
          output: {
            // @bab-ignore
            file: `dist/es2017/${entryName}.coffee`,
            format: "es",
          },
          plugins: [coffee(coffeeOptions), bab()],
        },
        {
          input: `src/${entryName}.coffee`,
          output: [
            { file: `dist/commonjs/${entryName}.coffee`, format: "cjs" },
            {
              file: `dist/amd/${entryName}.coffee`,
              format: "amd",
              amd: { id: entryName },
            },
            { file: `dist/native-modules/${entryName}.coffee`, format: "es" },
            { file: `dist/umd/${entryName}.coffee`, format: "umd", name: name },
            { file: `dist/system/${entryName}.coffee`, format: "system" },
          ],
          plugins: [coffee(coffeeOptions), bab()],
        },
      ]
);
