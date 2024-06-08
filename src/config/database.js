import mysql from "mysql";
import axios from "axios";

const dbName = process.env.DB_NAME;
const baseURL = process.env.BASE_URL;

// check if the database dbName exists, if not create it
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

connection.connect((error) => {
  if (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  } else {
    console.log("Connected to the database");
  }
});

connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (error) => {
  if (error) {
    console.error("Error creating the database:", error);
    process.exit(1);
  } else {
    console.log("Database created or successfully checked");
  }
});

connection.query(`USE ${dbName}`, (error) => {
  if (error) {
    console.error("Error using the database:", error);
    process.exit(1);
  } else {
    console.log("Database in use");
  }
});

// create the users table if it does not exist
const createTableSql = `
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email_verification_token VARCHAR(255),
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;`;

connection.query(createTableSql, (error) => {
  if (error) {
    console.error("Error creating the table:", error);
  } else {
    console.log("Table created or successfully checked");
  }
});

// insert a user into the users table if it does not exist using /register enpoint
const userData = {
  email: process.env.DEFAULT_USER_EMAIL,
  password: process.env.DEFAULT_USER_PASSWORD,
  firstName: process.env.DEFAULT_USER_FIRST_NAME,
  lastName: process.env.DEFAULT_USER_LAST_NAME,
  role: process.env.DEFAULT_USER_ROLE,
};

// check only if the user already exists in the db.  Do not insert the user in any case.
const checkUserSql = `SELECT * FROM users WHERE email = ?`;

const userExists = await new Promise((resolve) => {
  connection.query(checkUserSql, [userData.email], (error, results) => {
    if (error) {
      console.error("Error checking for user:", error);
      return resolve(false);
    }
    if (results.length === 0) {
      console.log("User does not exist");
      resolve(false);
    } else {
      console.log("User already exists");
      resolve(true);
    }
  });
});

// using the base url, call the /register endpoint to insert the user into the db if it does not exist
const registerUrl = `${baseURL}/register`;

if (userExists) {
  console.log("User already exists");
} else {
  axios
    .post(registerUrl, userData)
    .then((response) => {
      console.log("User registered successfully");
    })
    .catch((error) => {
      console.error("Error registering user:", error);
    });
}

export default connection;
