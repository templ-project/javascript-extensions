def modules = [:]
pipeline {
  agent 'master'

  environment {
    NVM_DIR = "${HOME}/.nvm"
  }

  stages {
    stage('Info') {
      steps {
        echo "NVM lies in ${NVM_DIR}"

        sh """
          set -ex;
          . ~/.bashrc;

          node --version;
          npm --version;
          """
      }
    }

    // Mocha

    stage('Testing CoffeeScript, EsLint, Mocha') {
      steps {
        script {
          testing('coffee', 'eslint', 'mocha')
        }
      }
    }
    stage('Testing CoffeeScript, EsLint/Airbnb, Mocha') {
      steps {
        script {
          testing('coffee', 'airbnb', 'mocha')
        }
      }
    }

    stage('Testing Flow, EsLint, Mocha') {
      steps {
        script {
          testing('flow', 'eslint', 'mocha')
        }
      }
    }
    stage('Testing Flow, EsLint/Airbnb, Mocha') {
      steps {
        script {
          testing('flow', 'airbnb', 'mocha')
        }
      }
    }

    stage('Testing JavaScript, EsLint, Mocha') {
      steps {
        script {
          testing('javascript', 'eslint', 'mocha')
        }
      }
    }
    stage('Testing JavaScript, EsLint/Airbnb, Mocha') {
      steps {
        script {
          testing('javascript', 'airbnb', 'mocha')
        }
      }
    }

    stage('Testing TypeScript, EsLint, Mocha') {
      steps {
        script {
          testing('typescript', 'eslint', 'mocha')
        }
      }
    }
    stage('Testing TypeScript, EsLint/Airbnb, Mocha') {
      steps {
        script {
          testing('typescript', 'airbnb', 'mocha')
        }
      }
    }

    // Jest

    stage('Testing CoffeeScript, EsLint, Jest') {
      steps {
        script {
          testing('coffee', 'eslint', 'jest')
        }
      }
    }
    stage('Testing CoffeeScript, EsLint/Airbnb, Jest') {
      steps {
        script {
          testing('coffee', 'airbnb', 'jest')
        }
      }
    }

    stage('Testing Flow, EsLint, Jest') {
      steps {
        script {
          testing('flow', 'eslint', 'jest')
        }
      }
    }
    stage('Testing Flow, EsLint/Airbnb, Jest') {
      steps {
        script {
          testing('flow', 'airbnb', 'jest')
        }
      }
    }

    stage('Testing JavaScript, EsLint, Jest') {
      steps {
        script {
          testing('javascript', 'eslint', 'jest')
        }
      }
    }
    stage('Testing JavaScript, EsLint/Airbnb, Jest') {
      steps {
        script {
          testing('javascript', 'airbnb', 'jest')
        }
      }
    }

    stage('Testing TypeScript, EsLint, Jest') {
      steps {
        script {
          testing('typescript', 'eslint', 'jest')
        }
      }
    }
    stage('Testing TypeScript, EsLint/Airbnb, Jest') {
      steps {
        script {
          testing('typescript', 'airbnb', 'jest')
        }
      }
    }
  }
}

def testing(def lang, def lint, def test) {
  sh """
    . ~/.bashrc > /dev/null;
    set -ex;
    bash ./.scripts/travis-test.sh ${lang} ${lint} ${test}
    """
}
