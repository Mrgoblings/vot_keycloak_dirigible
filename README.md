# Docker Keycloak Postgre w/ 2 clusters project (DKP2C project) - Tabler

Welcome to our Docker Compose project! This README will guide you through the setup and usage of our application.

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Our Docker Compose project is designed to help you set up a development and production environment for your application using Docker containers. With this project, you can easily create and manage multiple clusters for different stages of your application.

## Installation
To install and run the project locally, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/your-username/your-repo.git
    ```

2. Navigate to the project directory:
    ```
    cd your-repo
    ```

3. Start the development cluster:
    ```
    docker-compose -f docker-compose.dev.yml up -d
    ```

4. Start the production cluster:
    ```
    docker-compose -f docker-compose.prod.yml up -d
    ```

5. Open your browser and visit `http://localhost:3000` to access the application.

## Usage
Once the project is up and running, you can start using the application. Here's a brief overview of the project's features:

- **Development Cluster**: Use the development cluster for local development and testing. This cluster is optimized for rapid development and includes all the necessary services.

- **Production Cluster**: Use the production cluster for deploying your application to a production environment. This cluster is optimized for performance and scalability.

- **Keycloak**: Use Keycloak for user authentication and authorization. You can configure Keycloak by updating the environment variables.

- **Front-end**: The front-end service contains the user interface of your application. You can customize the front-end by modifying the source code.

- **Back-end**: The back-end service contains the server-side logic of your application. You can customize the back-end by modifying the source code.

- **PostgreSQL**: Use PostgreSQL as the database for your application. You can configure PostgreSQL by updating the environment variables.

## Contributing
We welcome contributions from the community! If you'd like to contribute to our project, please follow these guidelines:

1. Fork the repository and create a new branch.

2. Make your changes and ensure that the project is still functioning correctly.

3. Submit a pull request with a clear description of your changes.


## License
This project is licensed under the [MIT License](LICENSE).

We hope you find our Docker Compose project helpful in setting up your application environment. If you have any questions or encounter any issues, please don't hesitate to reach out to us.

Happy coding! :D