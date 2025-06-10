import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllPlaylists,
  getPlaylistById,
  createOrUpdatePlaylist,
  deletePlaylist,
  removeSongsFromPlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

router.get("/", protectRoute, getAllPlaylists);
router.get("/:playlistId", protectRoute, getPlaylistById);
router.post("/cr", protectRoute, createOrUpdatePlaylist);
router.put("/cr", protectRoute, createOrUpdatePlaylist);
router.delete("/:playlistId", protectRoute, deletePlaylist);
router.patch("/:playlistId/songs", removeSongsFromPlaylist);
export default router;
