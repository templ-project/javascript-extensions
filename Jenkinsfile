pipeline {
  agent any

  stages {
    stage('Info') {
      steps {
        sh '''set -ex;
          source ~/.bashrc;
          node --version;
          nvm --version'''
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
