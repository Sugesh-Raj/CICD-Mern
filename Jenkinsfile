pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                checkout scm
            }
        }
        
        stage('Backend Tests') {
            steps {
                echo 'Building Backend Image for Testing...'
                // We build a self-contained image to avoid Docker-in-Docker volume mounting issues
                sh 'docker build -t mern-backend-test ./Backend'
                echo 'Running tests inside isolated container...'
                sh 'docker run --rm mern-backend-test npm test'
            }
        }

        stage('Deploy (Local)') {
            steps {
                echo 'Deploying application locally using Docker Compose...'
                // Use the CI-specific compose file that doesn't rely on local volume mounts
                sh 'docker compose -f docker-compose.ci.yml up --build -d'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
