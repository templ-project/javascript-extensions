const fs = require('fs');

const to_rc = (obj, label = '.prettierrc') => {
  fs.writeFileSync(
    `${label}.js`,
    `// ${label}.js
module.exports = ${JSON.stringify(obj, null, 2)};`,
  );
};

const to_package = (obj, package, label = 'prettier') => {
  package[label] = obj;
  return package;
};

module.exports = {
  to_rc,
  to_package,
};
