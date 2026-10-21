import e from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  validateUser,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticateToken.js";

const authRouter = e.Router();

authRouter.get("/me", authenticate, validateUser);

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.post("/logout", logoutUser);

export default authRouter;
