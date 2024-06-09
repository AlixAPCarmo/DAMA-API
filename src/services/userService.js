import User from "../models/userModel.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendPasswordResetEmail } from '../utils/emailUtil.js';

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const UserService = {
  create: async (userData) => {
    return new Promise((resolve, reject) => {
      User.create(userData, (err, result, verificationToken) => {
        if (err) {
          reject(err);
        } else {
          // Include the verificationToken in the resolved value
          resolve({ result, verificationToken });
        }
      });
    });
  },

  findByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      User.findByEmail(email, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  },

  findById: async (id) => {
    return new Promise((resolve, reject) => {
      User.findById(id, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  },

  update: async (id, userData) => {
    return new Promise((resolve, reject) => {
      User.update(id, userData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      User.delete(id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findAll: async () => {
    return new Promise((resolve, reject) => {
      User.findAll((err, users) => {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
    });
  },

  verifyEmail: async (token) => {
    return new Promise((resolve, reject) => {
      User.verifyEmail(token, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  async requestPasswordReset(email) {
    return new Promise((resolve, reject) => {
      const token = crypto.randomBytes(20).toString("hex");
      const expirationDate = new Date(Date.now() + 3600000);

      User.findByEmail(email, async (err, user) => {
        if (err || !user) {
          console.error("findByEmail error or user not found:", err);
          reject("User not found or error fetching user.");
          return;
        }
        User.storeResetToken(
          email,
          token,
          expirationDate,
          async (err) => {
            if (err) {
              console.error("storeResetToken error:", err);
              reject("Error storing reset token.");
              return;
            }
            try {
              console.log(`Password reset token generated: ${token}`);
              await sendPasswordResetEmail(email, token);
              console.log("Password reset email sent successfully");
              resolve(true);
            } catch (emailError) {
              console.error("sendPasswordResetEmail error:", emailError);
              reject("Error sending password reset email.");
            }
          }
        );
      });
    });
  },

  // Reset password
  async resetPassword(token, newPassword) {
    console.log(`resetPassword called with token: ${token} and newPassword: ${newPassword}`);
    const user = await User.findUserByResetToken(token);
    if (!user) {
      throw new Error("TokenInvalid");
    }

    if (new Date() > new Date(user.token_expiration)) {
      throw new Error("TokenExpired");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const success = await User.updateUserPasswordAndInvalidateToken(
      user.user_id,
      hashedPassword
    );
    if (!success) {
      throw new Error("PasswordUpdateFailed");
    }

    console.log("Password reset successfully");
    return true;
  },
};
export default UserService;
