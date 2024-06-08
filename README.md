# nodejs-backend-base
The Backend Base for all Caravela NodeJS Projects.

## Introduction

This project is a Node.js base for web applications. 

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Features](#features)
4. [Dependencies](#dependencies)
5. [Scripts](#scripts)
6. [Configuration](#configuration)
7. [Documentation](#documentation)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)
10. [Contributors](#contributors)
11. [License](#license)


## Installation

To install this project, you need Node.js and npm installed on your system. Once these prerequisites are met, follow these steps:

```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
npm install
```

## Usage

To run the application, use the following command:

```bash
npm start
```

## Features
    - REST API creation
    - Database integration
    - Authentication and Authorization
    - Pre-configured with essential dependencies
    - Simplified setup for new projects

## Dependencies

Key dependencies include:

    Express for server management
    MySQL for database interactions
    Passport for authentication
    Bcrypt for data encryption
    Nodemailer for email functionalities
    Axios for HTTP requests

## Scripts
The package.json includes the following scripts:

    start: Launches the server using nodemon for live reloading (nodemon ./src/server.js)

## Configuration

To configure the application, create a .env file in the project root and specify your configuration variables. For example:

```bash
# Server configuration
SERVER_PORT= server port

# Database configuration
DB_HOST=db host
DB_USER=db user
DB_PASSWORD=db passwd
DB_NAME=dbname
DB_PORT=db port

# Session configuration
SESSION_SECRET= "secret"

# Salt configuration
SALT_ROUNDS=salt rounds 

# Email configuration
EMAIL_SERVICE= email service
EMAIL_USERNAME= email username
EMAIL_PASSWORD=email password
BASE_URL=base url

# Default user configuration
DEFAULT_USER_EMAIL="email"
DEFAULT_USER_PASSWORD="passwd"
DEFAULT_USER_ROLE = "role"
DEFAULT_USER_FIRST_NAME="FName"
DEFAULT_USER_LAST_NAME="lName"

```

**The file .env mustn't be commited to git as it contains sensitive information.**

## Documentation
What is Documentation? 

## Examples

**API Endpoint**

```bash
router.get('/api/example', (req, res) => {
  res.status(XXX).json({
    ok: true or false,
    data: data,
    error: error message,
    status: XXX, 
    message: 'This is a sample endpoint'});
});
```

## Troubleshooting

Common issues and solutions:

    Application won't start: Ensure all dependencies are installed (npm install) and environment variables are set.
    
    Database connection issues: Verify the database connection string in .env file.

## Contributors
Caravela Aclamada

## License

This project is licensed under the ISC License.
