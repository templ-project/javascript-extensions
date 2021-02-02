const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const {LANG_COFFEE, LANG_TS, LANGS, SRC_APP, SRC_SRC} = require('./const');
const twig = require('./twig');

const srcCode = async (answers) => {
  fse.removeSync(SRC_APP)
  fse.removeSync(SRC_SRC)

  let ext = 'js'
  if (answers.language === LANG_COFFEE) {
    ext = 'coffee'
  }
  if (answers.language === LANG_TS) {
    ext = 'ts'
  }

  options = {
    answers,
    ext,
    LANGS
  }

  await fs.promises.mkdir(answers.src)

  rendered = await twig('./.scripts/cl/twig/index.code.twig', options)
  return fs.promises.writeFile(`${answers.src}/index.${ext}`, rendered)
};

module.exports = srcCode;
