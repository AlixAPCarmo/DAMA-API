import UserService from "../services/userService.js";
import passport from "../config/passport.js";
import { sendVerificationEmail } from "../utils/emailUtil.js";

const UserController = {
  //register a new user
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      // Create user and receive the verification token
      const { result, verificationToken } = await UserService.create({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      // Send a verification email
      if (verificationToken) {
        await sendVerificationEmail(email, verificationToken);
      }

      return res.status(201).json({
        ok: true,
        message:
          "User registered successfully. Please check your email to verify your account.",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        status: 500,
        error: "Error registering user.",
        // message: error.message,
      });
    }
  },

  //login a user
  login: async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.status(401).json({
          ok: false,
          data: [],
          status: 401,
          error: "Incorrect email or password.",
        });
      }

      if (!user.email_verified) {
        return res.status(401).json({
          ok: false,
          data: [],
          status: 401,
          error: "Email not verified.",
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        return res.status(200).json({
          ok: true,
          data: [],
          status: 200,
          errpr: null,
          message: "Logged in successfully.",
          data: user,
        });
      });
    })(req, res, next);
  },

  //logout a user
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          data: [],
          status: 500,
          error: "Error logging out.",
        });
      }

      // Clear the session cookie
      res.clearCookie("connect.sid");

      res.status(200).json({
        ok: true,
        data: [],
        status: 200,
        error: null,
        message: "Successfully logged out.",
      });
    });
  },

  //get user information
  getUser: async (req, res) => {
    try {
      const user = await UserService.findById(req.user.user_id);
      if (!user) {
        return res.status(404).json({
          ok: false,
          data: [],
          status: 404,
          error: "User not found.",
        });
      }

      return res.status(200).json({
        ok: true,
        data: user,
        status: 200,
        error: null,
        message: "User found successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: [],
        error: "Error fetching user information.",
        status: 500,
      });
    }
  },

  //update user information
  updateUser: async (req, res) => {
    try {
      const { userId, ...userData } = req.body;
      const result = await UserService.update(userId, userData);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          ok: false,
          data: [],
          status: 404,
          error: "User not found or no data changed.",
        });
      }

      return res.status(200).json({
        ok: true,
        data: [],
        status: 200,
        message: "User updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: [],
        error: "Error updating user.",
        status: 500,
      });
    }
  },

  //delete a user
  deleteUser: async (req, res) => {
    try {
      const { userID } = req.body;
      const result = await UserService.delete(userID);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          ok: false,
          data: [],
          status: 404,
          error: "User not found.",
        });
      }

      return res.status(200).json({
        ok: true,
        data: [],
        status: 200,
        error: null,
        message: "User deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: [],
        error: "Error deleting user.",
        status: 500,
      });
    }
  },

  //get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await UserService.findAll();

      return res.status(200).json({
        ok: true,
        data: users,
        status: 200,
        error: null,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        data: [],
        status: 500,
        error: "Error fetching users.",
      });
    }
  },

  //verify user email
  verifyEmail: async (req, res) => {
    const { token } = req.params;
    try {
      const result = await UserService.verifyEmail(token);
      if (result.affectedRows == 0) {
        return res.status(400).json({
          ok: false,
          error:
            "Verification failed. Token is invalid or email is already verified.",
          data: [],
        });
      }
      res.status(200).json({
        ok: true,
        data: [],
        error: null,
        message: "Email verified successfully.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ ok: false, data: [], error: "Error verifying email." });
    }
  },
  // Request password reset
  async requestPasswordReset(req, res) {
    const { email } = req.body;
    // check if email exists in the database
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ ok: false, error: "User not found." });
    }

    console.log(`Request password reset for email: ${email}`);
    try {
      const result = await UserService.requestPasswordReset(email);
      if (!result) {
        return res.status(404).json({ ok: false, error: "User not found." });
      }
      res.status(200).json({
        ok: true,
        message: "Password reset email sent successfully.",
      });
    } catch (error) {
      console.error("requestPasswordReset error:", error);
      res.status(500).json({ ok: false, error: error.toString() });
    }
  },

  // Reset password
  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    console.log(
      `resetPassword called with token: ${token} and newPassword: ${newPassword}`
    );
    try {
      const result = await UserService.resetPassword(token, newPassword);
      // Assuming result is true if successful
      if (result) {
        return res
          .status(200)
          .json({ ok: true, message: "Password reset successfully." });
      }
    } catch (error) {
      let errorMessage = error.message; // Default error message
      let statusCode = 500; // Default to internal server error

      // Example of handling specific custom error types or messages
      switch (error.message) {
        case "TokenInvalid":
          errorMessage = "Reset token is invalid.";
          statusCode = 400;
          break;
        case "TokenExpired":
          errorMessage = "Reset token has expired.";
          statusCode = 400;
          break;
        case "PasswordPolicyFailed":
          errorMessage = "New password does not meet the required policy.";
          statusCode = 400;
          break;
      }

      return res.status(statusCode).json({ ok: false, error: errorMessage });
    }
  },
};
export default UserController;
