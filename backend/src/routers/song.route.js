import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getPendingSongs,
  getSongById,
  getSongsByUser,
  getTrendingSongs,
  searchSongs,
  // editSong,
} from "../controller/song.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.get("/pending", getPendingSongs);
router.get("/user/:id", getSongsByUser);
router.get("/:id", getSongById);
// router.patch("/:id", protectRoute, editSong);

export default router;
