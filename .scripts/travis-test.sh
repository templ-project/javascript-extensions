#! /bin/bash
set -xe

export DEBUG=1

function do_clean() {
  rm -rf .babelrc.js .eslintrc.js .jscpd.json .mocharc.js .prettierrc.js app dist lib src test jest.config.js rollup.config.js tsconfig.json tsconfig.eslint.json .jscpd
  git checkout .github .gitlab package.json package-lock.json
}

VAL_SRC="src app"

VAL_TEST=".mocharc.js jest"

VAL_REPO=".github .gitlab"

function do_test() {
  echo
  echo "#################"
  echo TEMPLATE_ANSWERS="{\"language\":\"$1\",\"src\":\"$2\",\"dist\":\"$3\",\"testing\":\"$4\",\
\"inspectors\":[\"jscpd\"],\"repository\":\"$5\",\"lintRules\":\"$6\"}" \
  node ./.scripts/change-language.js
  echo "#################"
  echo

  TEMPLATE_ANSWERS="{\"language\":\"$1\",\"src\":\"$2\",\"dist\":\"$3\",\"testing\":\"$4\",\
\"inspectors\":[\"jscpd\"],\"repository\":\"$5\",\"lintRules\":\"$6\"}" \
  node ./.scripts/change-language.js

  if [[ ! -f .eslintrc.js ]]; then exit 1; fi
  if [[ ! -f .prettierrc.js ]]; then exit 1; fi

  # src
  for d in $VAL_SRC; do
    if [[ $2 != $d ]]; then
      if [[ -d $d ]]; then exit 1; fi
    else
      if [[ ! -d $d ]]; then exit 1; fi
    fi
  done

  # testing
  for f in $VAL_TEST; do
    if [[ $f != *"$4"* ]]; then
      if [ -f $f ]; then exit 1; fi
    else
      if [ ! -f $f ]; then exit 1; fi
    fi
  done

  if [ ! -f .jscpd.json ]; then exit 1; fi

  # repository
  for d in $VAL_REPO; do
    if [[ $d != *"$5"* ]]; then
      if [[ -d $d ]]; then exit 1; fi
    else
      if [[ ! -d $d ]]; then exit 1; fi
    fi
  done

}

# for lang in coffee flow javascript typescript; do
# for lang in coffee; do
# for lang in flow; do
# for lang in javascript; do
# for lang in typescript; do
for lang in $1; do
# for lint in airbnb eslint; do
# for lint in airbnb; do
# for lint in eslint; do
for lint in $2; do

  npm install
  # do_test $lang src dist $1 github $lint
  do_test $lang src dist $3 github $lint

  npm install
  npm update
  npm run prettier:write
  npm run lint:write
  npm run jscpd
  npm test
  do_clean
  npm install

done
done


export DEBUG=
