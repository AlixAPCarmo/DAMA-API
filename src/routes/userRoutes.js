import express from "express";
import UserController from "../controllers/userController.js";
import { authRole } from "../middleware/users/authRole.js";
import validateRegister from "../middleware/users/validations/validateRegister.js";
import validatePut from "../middleware/users/validations/validatePut.js";
import validateDelete from "../middleware/users/validations/validateDelete.js";

const router = express.Router();

router.post(
  "/register",
  validateRegister,
  UserController.register
);
router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

router.get(
  "/user",
  authRole(["Admin", "CEO", "Director", "Manager", "Employee"]),
  UserController.getUser
);

router.put(
  "/user",
  authRole(["Admin", "CEO", "Director", "Manager"]),
  validatePut,
  UserController.updateUser
);

router.delete(
  "/user",
  authRole(["Admin", "CEO", "Director"]),
  validateDelete,
  UserController.deleteUser
);

router.get(
  "/users",
  authRole(["Admin", "CEO", "Director", "Manager"]),
  UserController.getAllUsers
);

router.get("/verify-email/:token", UserController.verifyEmail);

router.post('/request-password-reset', UserController.requestPasswordReset);

router.post('/save-new-password', UserController.resetPassword);



export default router;
