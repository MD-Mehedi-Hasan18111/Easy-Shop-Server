import { Router } from "express";
import {
  signupUser,
  loginUser,
  refreshToken,
} from "../controllers/authController";

const router: Router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

export default router;
