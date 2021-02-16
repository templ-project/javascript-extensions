pipeline {
  agent any

  environment {
    NVM_DIR = "${HOME}/.nvm"
  }

  stages {
    stage('Info') {
      steps {
        sh '''
          [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
          [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
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
