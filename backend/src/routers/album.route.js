import { Router } from "express";
import {
  getAlbumById,
  getAlbumsByUser,
  getAllAlbums,
  getPendingAlbums,
} from "../controller/album.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/pending", protectRoute, getPendingAlbums);
router.get("/user/:id", protectRoute, getAlbumsByUser);
router.get("/:albumId", protectRoute, getAlbumById);

export default router;
