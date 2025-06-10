import { Router } from "express";
import { protectRoute, requireRole } from "../middleware/auth.middleware.js";
import { getStats, getUserStats } from "../controller/stat.controller.js";

const router = Router();

router.get("/", protectRoute, requireRole(["moderator", "admin"]), getStats);
router.get("/:userId/stats", getUserStats);
export default router;
