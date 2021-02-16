def testing(def lang, def lint, def test) {
  pipeline {
    agent any
    stages {
      stage('Testing ...') {
        echo "Testing ${lang}, ${lint}, ${test}"
        steps {
          sh """
            . ~/.bashrc > /dev/null;
            set -ex;
            bash ./.scripts/travis-test.sh ${lang} ${lint} ${test}
            """
        }
      }
    }
  }
}
