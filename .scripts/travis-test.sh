#! /bin/bash
set -xe

function do_clean() {
  rm -rf .eslintrc.js .jscpd.json .mocharc.js .prettierrc.js app dist lib src test jest.config.js rollup.config.js
  git checkout .github .gitlab package.json package-lock.json
}

VAL_SRC="src app"

VAL_TEST=".mocharc.js jest"

VAL_REPO=".github .gitlab"

function do_test() {
  TEMPLATE_ANSWERS="{\"language\":\"$1\",\"src\":\"$2\",\"dist\":\"$3\",\"testing\":\"$4\",\
\"inspectors\":[\"jscpd\"],\"repository\":\"$5\",\"lintRules\":\"$6\"}" \
  node ./.scripts/change-language.js

  if [ ! -f .eslintrc.js ]; then exit 1; fi
  if [ ! -f .prettierrc.js ]; then exit 1; fi

  # src
  for d in $VAL_SRC; do
    if [ $2 != $d ]; then
      if [ -d $d ]; then exit 1; fi
    else
      if [ ! -d $d ]; then exit 1; fi
    fi
  done

  # # testing
  # for f in $VAL_TEST; do
  #   if [[ $f != *"$4"* ]]; then
  #     if [ -f $f ]; then exit 1; fi
  #   else
  #     if [ ! -f $f ]; then exit 1; fi
  #   fi
  # done

  if [ ! -f .jscpd.json ]; then exit 1; fi

  # repository
  for d in $VAL_REPO; do
    if [[ $d != *"$5"* ]]; then
      if [ -d $d ]; then exit 1; fi
    else
      if [ ! -d $d ]; then exit 1; fi
    fi
  done

}

# for lang in coffee flow javascript typescript; do
for lang in flow javascript typescript; do
# for lint in eslint aribnb; do
for lint in eslint; do

  do_test $lang src dist $1 github $lint
  # node -e 'var prettier = require("./.prettierrc.js"); if (prettier.parser != "flow") process.exit(1);'
  npm i
  npm run prettier
  npm run lint
  npm run jscpd
  npm test
  do_clean

done
done
