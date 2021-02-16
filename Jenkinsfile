pipeline {
  agent any

  environment {
    NVM_DIR = "${HOME}/.nvm"
  }

  stages {
    stage('Info') {
      steps {
        sh '''
          bash ${env.NVM_DIR}/nvm.sh;
          bash ${env.NVM_DIR}/bash_completion;

          set -ex;
          source ~/.bashrc;
          node --version;
          nvm --version;
          '''
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
