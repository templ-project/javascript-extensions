const fs = require('fs');
const prettier = require("prettier");
const Twig = require('twig');
const { LANG_COFFEE } = require('./const');

const twig = async (file, options) => new Promise((resolve, reject) => {
  console.log(fs.realpathSync(file))

  Twig.renderFile(file, options || {}, (err, html) => {
    if (!err) {
      if ((((options||{}).answers||{}).language !== LANG_COFFEE)) {
        html = prettier.format(html, {
          parser: file.match(/json/) ? 'json' : 'babel',
          printWidth: 120,
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'all',
          bracketSpacing: false,
        });
      }
      return resolve(html)
    }
    reject(err)
  });
})


module.exports = twig;
