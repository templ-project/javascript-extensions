const fs = require('fs');
const fse = require('fs-extra');
const {LANGS, LANG_COFFEE, LANG_FLOW, LANG_TS, TEST_JEST} = require('./const');
const twig = require('./twig');

const testCode = async (answers) => {
  fse.removeSync('test');

  let ext = 'js';

  switch (answers.language) {
    case LANG_COFFEE:
      // https://code.tutsplus.com/tutorials/better-coffeescript-testing-with-mocha--net-24696
      ext = 'coffee';
      break;
    case LANG_TS:
      ext = 'ts';
    case LANG_FLOW:
    default:
  }

  const options = {
    answers,
    ext,
    LANGS,
  }

  fs.mkdirSync('test', {recursive: true});


  if (answers.language === LANG_COFFEE) {
    const rendered = await twig('./.scripts/cl/twig/jest.preprocessor.js.twig', options)
      await fs.promises.writeFile(`./test/preprocessor.js`, rendered)
  }


  if (answers.language === LANG_TS) {
    const rendered = await twig('./.scripts/cl/twig/jest.tsconfig.json.twig', options)
    await fs.promises.writeFile(`./test/tsconfig.json`, rendered
  )}

  const rendered = await twig('./.scripts/cl/twig/jest.test.code.twig', options)
  return fs.promises.writeFile(`./test/index.test.${ext}`, rendered)
};

const jestrc = async (answers, package) => {
  if (answers.testing !== TEST_JEST) {
    return;
  }
  await testCode(answers);

  const options = {
    answers,
    jest: {
      clearMocks: true,
      coverageDirectory: 'coverage',
      moduleFileExtensions: ['js', 'json', 'jsx'],
      // rootDir: '.',
      roots: [ "test" ],
      transform: {},
      testEnvironment: 'node',
    },
    LANGS,
  };

  switch (answers.language) {
    case LANG_COFFEE:
      options.jest = {
        ...options.jest,
        moduleDirectories: [ 'node_modules', answers.src, 'test' ],
        moduleFileExtensions: [...options.jest.moduleFileExtensions, 'coffee'],
        // roots: [ "test" ]
        testMatch: ["**/__tests__/**/*.coffee", "**/?(*.)+(spec|test).coffee"],
        transform: {
          ".*": "<rootDir>/test/preprocessor.js",
        },
      }

      break;
    case LANG_TS:
      options.jest = {
        ...options.jest,
        moduleFileExtensions: [...options.jest.moduleFileExtensions, 'ts', 'tsx'],
        transform: {
          ...options.jest.transform,
          ...{"^.+\\.(t|j)s$": "ts-jest"},
        },
      }

      package.newDevDependencies = {
        ...(package.newDevDependencies || {}),
        'ts-jest': '?',
      };
      break;
    case LANG_FLOW:
    default:
      options.jest = {
        ...options.jest,
        // require: [...options.jest.require.filter(a => a !== '@babel/register')]
        transform: {
          ...options.jest.transform,
          ...{"\\.[jt]sx?$": "babel-jest"},
        },
      }

      package.newDevDependencies = {
        ...(package.newDevDependencies || {}),
        '@babel/register': '?',
        'babel-jest': '?',
      };
  }

  package.newDevDependencies = {
    ...(package.newDevDependencies || {}),
    jest: '?',
    'eslint-plugin-jest': '?',
  };

  if (answers.language === LANG_TS) {
    package.newDevDependencies = {
      ...(package.newDevDependencies || {}),
      '@types/jest': '?',
    };
  }

  package.scripts = {
    ...(package.scripts || {}),
    test: 'cross-env NODE_ENV=test NO_API_DOC=1 jest --coverage --runInBand --verbose',
    'test:watch': 'npm run test -- --watch',
  };

  // console.log(
  //   // answers,
  //   options,
  //   // package,
  // );
  // process.exit(1)

  const rendered = await twig('./.scripts/cl/twig/jest.config.js.twig', options)
  try {
    await fs.promises.unlink('./jest.config.js');
  } catch (e) {}
  return fs.promises.writeFile(`./jest.config.js`, rendered)
};

module.exports = jestrc;
