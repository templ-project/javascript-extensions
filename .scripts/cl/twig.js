const fs = require('fs');
const Twig = require('twig');

const twig = async (file, options) => new Promise((resolve, reject) => {
  console.log(fs.realpathSync(file))
  Twig.renderFile(file, options || {}, (err, html) => {
    if (!err) {
      return resolve(html)
    }
    reject(err)
  });
})


module.exports = twig;
