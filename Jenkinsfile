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
          bash ${env.NVM_DIR}/nvm.sh;
          bash ${env.NVM_DIR}/bash_completion;

          set -ex;
          source ~/.bashrc;
          node --version;
          npm --version;
          """
      }
    }
    stage('Test Mocha') {
      steps {
        sh 'bash ./.scripts/travis-test.sh mocha'
      }
    }
    stage('Test Jest') {
      steps {
        sh 'bash ./.scripts/travis-test.sh jest'
      }
    }
  }
}
