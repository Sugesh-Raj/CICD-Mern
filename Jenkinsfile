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
                echo 'Running Backend Tests...'
                dir('Backend') {
                    // We run a temporary node container directly via shell to bypass the need for the Docker Pipeline plugin
                    sh 'docker run --rm -v ${WORKSPACE}/Backend:/app -w /app node:20-alpine sh -c "npm install && npm test"'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker Compose Images...'
                // Using docker-compose to build the frontend and backend images
                sh 'docker-compose build'
            }
        }

        stage('Deploy (Local)') {
            steps {
                echo 'Deploying application locally using Docker Compose...'
                // Restarting containers in detached mode with newly built images
                sh 'docker-compose up -d'
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
