// import dts from "rollup-plugin-dts";

// import typescript from "rollup-plugin-typescript2";

const isProduction = process.env.NODE_ENV === "production";

const entryName = "index";

const name = "gw.common";

// const ts = (target = "es2015") =>
//   typescript({
//     cacheRoot: ".rollupcache",
//     // tsconfigDefaults: defaultCfg,
//     // tsconfig: undefined,
//     tsconfigOverride: {
//       compilerOptions: {
//         module: "es2015",
//         target: target,
//       },
//       exclude: [],
//       include: ["src"],
//     },
//     useTsconfigDeclarationDir: true,
//   });

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
    // plugins: [ts()],
  },
  // {
  //   input: "./src/index.js",
  //   output: [{ file: "dist/index.d.js", format: "es" }],
  //   plugins: [dts()],
  // },
].concat(
  !isProduction
    ? []
    : [
        {
          input: `src/${entryName}.js`,
          output: {
            // @ts-ignore
            file: `dist/es2017/${entryName}.js`,
            format: "es",
          },
          // plugins: [ts("es2017")],
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
          // plugins: [ts("es5")],
        },
      ]
);
