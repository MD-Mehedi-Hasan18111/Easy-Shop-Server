import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router: Router = Router();

router.use(authenticateJWT); // Protect all routes below this line

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
