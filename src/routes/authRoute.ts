import { Router } from "express";
import {
  signupUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router: Router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);

export default router;
