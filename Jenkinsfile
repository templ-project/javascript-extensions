pipeline {
  agent any

  environment {
    NVM_DIR = "${HOME}/.nvm"
  }

  stages {
    stage('Info') {
      steps {
        echo "NVM lies in ${NVM_DIR}"

        sh """
          . ~/.bashrc;

          set -ex;
          node --version;
          npm --version;
          """
      }
    }
    // stage('Testing CoffeeScript, EsLint, Mocha') {
    //   steps {
    //     sh '''
    //       . ~/.bashrc > /dev/null;
    //       set -ex;
    //       bash ./.scripts/travis-test.sh coffee eslint mocha
    //       '''
    //   }
    // }
    // stage('Testing CoffeeScript, EsLint/Airbnb, Mocha') {
    //   steps {
    //     sh '''
    //       . ~/.bashrc > /dev/null;
    //       set -ex;
    //       bash ./.scripts/travis-test.sh coffee airbnb mocha
    //       '''
    //   }
    // }
    stage('Testing ...') {
      steps {
        testing('flow', 'eslint', 'mocha')
        testing('flow', 'airbnb', 'mocha')
      }
    }
    // stage('Test Jest') {
    //   steps {
    //     sh 'bash ./.scripts/travis-test.sh jest'
    //   }
    // }
  }
}


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
