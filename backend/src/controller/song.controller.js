import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find({ status: "approved" })
      .sort({ createdAt: -1 })
      // .populate("uploadedBy", "fullName")
      .populate("albumId", "title");

    res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getAllSongs", error);
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $match: { status: "approved" } },
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $match: { status: "approved" } },
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $match: { status: "approved" } },
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findOne({
      _id: id,
      status: "approved",
    }).select("_id title artist imageUrl audioUrl duration albumId createdAt");

    if (!song) {
      return res.status(404).json({ message: "Song not found." });
    }

    res.json(song);
  } catch (error) {
    next(error);
  }
};

export const searchSongs = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Missing query parameter." });
    }

    const regex = new RegExp(query, "i");

    const songs = await Song.find({
      status: "approved",
      $or: [{ title: regex }, { artist: regex }],
    }).select("_id title artist imageUrl audioUrl");

    const albums = await Album.find({
      status: "approved",
      $or: [{ title: regex }, { artist: regex }],
    }).select("_id title artist imageUrl releaseYear");

    res.json({ songs, albums });
  } catch (error) {
    next(error);
  }
};

export const uploadSong = async (req, res) => {
  try {
    // Lấy thông tin user hiện tại từ req.auth.userId (Clerk hoặc auth middleware)
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, artist, imageUrl, audioUrl, duration, albumId } = req.body;

    // Phân quyền: moderator và admin bài upload auto approved
    const status = ["moderator", "admin"].includes(user.role)
      ? "approved"
      : "pending";

    // Tạo bài hát mới
    const newSong = new Song({
      title,
      artist,
      imageUrl,
      audioUrl,
      duration,
      albumId: albumId ? mongoose.Types.ObjectId(albumId) : null,
      status,
      uploadedBy: user._id,
    });

    await newSong.save();

    return res
      .status(201)
      .json({ message: "Song uploaded successfully", song: newSong });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSongsByUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      console.log("Backend: User not found for clerkId:", id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Backend: Found user:", user.fullName);

    const songs = await Song.find({ uploadedBy: user._id })
      .sort({ createdAt: -1 }) // Mới nhất trước
      .populate("albumId") // Nếu muốn lấy thông tin album
      .select("-__v"); // Ẩn __v

    console.log("Backend: Found songs count:", songs.length);

    res.status(200).json({ count: songs.length, songs });
  } catch (error) {
    console.error("Error in getSongsByUser:", error);
    next(error);
  }
};
export const getPendingSongs = async (req, res) => {
  try {
    const songs = await Song.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("albumId", "title");

    res.status(200).json(songs);
  } catch (error) {
    console.error("Error in getPendingSongs:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching pending songs" });
  }
};
