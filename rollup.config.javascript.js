const isProduction = process.env.NODE_ENV === "production";

const entryName = "index";

/**
 * Replace this with the name of your module
 */
const name = "javascript-template";

export default [
  {
    input: `src/${entryName}.js`,
    output: [
      {
        file: `dist/es2015/${entryName}.js`,
        format: "es",
      },
      {
        file: `dist/umd-es2015/${entryName}.js`,
        format: "umd",
        name: name,
      },
    ],
  },
].concat(
  !isProduction
    ? []
    : [
        {
          input: `src/${entryName}.js`,
          output: {
            file: `dist/es2017/${entryName}.js`,
            format: "es",
          },
        },
        {
          input: `src/${entryName}.js`,
          output: [
            { file: `dist/commonjs/${entryName}.js`, format: "cjs" },
            {
              file: `dist/amd/${entryName}.js`,
              format: "amd",
              amd: { id: entryName },
            },
            { file: `dist/native-modules/${entryName}.js`, format: "es" },
            { file: `dist/umd/${entryName}.js`, format: "umd", name: name },
            { file: `dist/system/${entryName}.js`, format: "system" },
          ],
        },
      ]
);
