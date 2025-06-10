import { Router } from "express";
import { protectRoute, requireAdmin, requireRole } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getCurrentUser,
  getMessages,
  getUsersByRole,
  updateUserPermissions,
} from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.patch(
  "/:userId/upload-permission",
  protectRoute,
  requireRole(["admin"]),
  updateUserPermissions
);
router.get(
  "/roles/:role",
  protectRoute,
  requireRole(["admin"]),
  getUsersByRole
);
router.get("/me", protectRoute, getCurrentUser);

export default router;
