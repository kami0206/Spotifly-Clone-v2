import { Router } from "express";
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
  // editAlbum,
  // editSong,
  reviewAlbum,
  reviewSong,
  updateUserRole,
} from "../controller/admin.controller.js";
import { protectRoute, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/check",
  protectRoute,
  requireRole(["moderator", "admin"]),
  checkAdmin
);

router.post("/songs", protectRoute, createSong);
router.delete("/songs/:id", protectRoute, deleteSong);
// router.patch("/songs/:id", protectRoute, editSong);

router.post("/albums", protectRoute, createAlbum);
router.delete("/albums/:id", protectRoute, deleteAlbum);
// router.patch("/albums/:id", protectRoute, editAlbum);

router.patch(
  "/songs/:id/status",
  protectRoute,
  requireRole(["moderator", "admin"]),
  reviewSong
);
router.patch(
  "/albums/:id/status",
  protectRoute,
  requireRole(["moderator", "admin"]),
  reviewAlbum
);

router.patch("/role/:id", protectRoute, requireRole(["admin"]), updateUserRole);

export default router;
