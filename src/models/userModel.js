import bcrypt from "bcrypt";
import connection from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const User = {
  create: function (userData, callback) {
    bcrypt.hash(userData.password, saltRounds, (err, hash) => {
      if (err) {
        return callback(err);
      }
      // Generate a verification token
      const verificationToken = uuidv4();
      connection.query(
        `INSERT INTO users (email, password, first_name, last_name, role, email_verified, email_verification_token) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.email,
          hash,
          userData.firstName,
          userData.lastName,
          userData.role,
          false, // email_verified is false by default
          verificationToken, // Store the generated verification token
        ],
        (error, results) => {
          // Pass both the error/results and the token back to the callback
          callback(error, results, verificationToken);
        }
      );
    });
  },

  findByEmail: function (email, callback) {
    connection.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  findById: function (id, callback) {
    connection.query("SELECT * FROM users WHERE user_id = ?", [id], callback);
  },

  // Additional method to find user by verification token
  findByVerificationToken: function (token, callback) {
    connection.query(
      "SELECT * FROM users WHERE email_verification_token = ?",
      [token],
      callback
    );
  },

  update: function (id, userData, callback) {
    connection.query(
      `UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ?, email_verified = ?, email_verification_token = ? WHERE user_id = ?`,
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.role,
        userData.emailVerified || false,
        userData.emailVerificationToken || null,
        id,
      ],
      callback
    );
  },

  delete: function (id, callback) {
    connection.query("DELETE FROM users WHERE user_id = ?", [id], callback);
  },

  findAll: function (callback) {
    connection.query("SELECT * FROM users", callback);
  },

  // Method to update email verified status
  verifyEmail: function (token, callback) {
    connection.query(
      `UPDATE users SET email_verified = true, email_verification_token = NULL WHERE email_verification_token = ?`,
      [token], // Match the token in the database and set email_verified to true
      callback
    );
  },

  // Store password reset token
  storeResetToken(email, token, expirationDate, callback) {
    const sql = `UPDATE users SET password_reset_token = ?, token_expiration = ? WHERE email = ?`;
    connection.query(sql, [token, expirationDate, email], (error, result) => {
      if (error) {
        console.error(`Error storing reset token for email ${email}:`, error);
      } else {
        console.log(`Reset token stored for email ${email}`);
      }
      callback(error, result);
    });
  },

  findUserByResetToken(token) {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT * FROM users WHERE password_reset_token = ? AND token_expiration > NOW()";
      connection.query(sql, [token], (error, results) => {
        if (error) {
          console.error(`Error finding user by reset token ${token}:`, error);
          reject(error);
        } else {
          console.log(`User found for reset token ${token}`);
          resolve(results.length ? results[0] : null);
        }
      });
    });
  },

  updateUserPasswordAndInvalidateToken(user_id, hashedPassword) {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE users SET password = ?, password_reset_token = NULL, token_expiration = NULL WHERE user_id = ?";
      connection.query(sql, [hashedPassword, user_id], (error, result) => {
        if (error) {
          console.error(`Error updating password for user ${user_id}:`, error);
          reject(error);
        } else if (result.affectedRows === 0) {
          console.error(`No rows updated for user ${user_id}`);
          reject(
            new Error(
              "No rows updated, possibly due to invalid user identifier."
            )
          );
        } else {
          console.log(`Password updated successfully for user ${user_id}`);
          resolve(true);
        }
      });
    });
  },
};

export default User;
