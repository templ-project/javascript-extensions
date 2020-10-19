#! /bin/bash
set -xe

TEMPLATE_ANSWERS='{"language":"javascript","src":"src","dist":"dist","testing":"mocha","inspectors":["jscpd","dependency-cruiser"],"repository":"github","to":"file"}' \
  node ./.scripts/change-language.js

[ -f .eslintrc.js ] || exit 1
[ -f .prettierrc.js ] || exit 1
[ -f jscpd.json ] || exit 1

[ -f .github ] || exit 1
[ -f .gitlab ] && exit 1

[ -d src ] || exit 1
[ -d dist ] || exit 1
[ -d app ] && exit 1
[ -d lib ] && exit 1
