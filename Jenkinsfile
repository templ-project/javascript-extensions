pipeline {
  agent any

  stages {
    stage('Test Mocha') {
      steps {
        bash 'bash -c ./.scripts/travis-test.sh mocha'
      }
    }
    stage('Test Jest') {
      steps {
        bash 'bash -c ./.scripts/travis-test.sh jest'
      }
    }
  }
}
