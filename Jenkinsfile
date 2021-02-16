pipeline {
  agent any

  stages {
    stage('Test Mocha') {
      steps {
        sh 'bash -c ./.scripts/travis-test.sh mocha'
      }
    }
    stage('Test Jest') {
      steps {
        sh 'bash -c ./.scripts/travis-test.sh jest'
      }
    }
  }
}
