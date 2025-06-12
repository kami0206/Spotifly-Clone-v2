import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import { User } from "../models/user.model.js";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Vui lòng tải lên tất cả các tệp" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Tự động duyệt nếu là admin hoặc moderator
    const autoApprove = ["admin", "moderator"].includes(user.role);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
      status: autoApprove ? "approved" : "pending",
      uploadedBy: user._id,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res
      .status(201)
      .json({ message: "Bài hát đã được tải lên và đang chờ duyệt", song });
  } catch (error) {
    console.log("Lỗi trong createSong", error);
    next(error);
  }
};
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    // if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const autoApprove = ["admin", "moderator"].includes(user.role);
    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
      status: autoApprove ? "approved" : "pending",
      uploadedBy: user._id,
    });

    await album.save();

    res.status(201).json({
      message: autoApprove
        ? "Album created and auto-approved"
        : "Album created and pending approval",
      album,
    });
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};

export const reviewSong = async (req, res) => {
  try {
    const { id: songId } = req.params;
    const { action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Song not found" });

    // Cập nhật status bài hát
    song.status = action === "approve" ? "approved" : "rejected";
    await song.save();

    return res
      .status(200)
      .json({ message: `Song ${action}d successfully`, song });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const reviewAlbum = async (req, res) => {
  try {
    const { id: albumId } = req.params;
    const { action } = req.body;

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { status: action },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(updatedAlbum);
  } catch (error) {
    console.error("Error updating album status:", error);
    res.status(500).json({ message: "Server error updating album status" });
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "moderator", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findOne({ clerkId: id });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;

    // Gán canUpload dựa theo role
    if (role === "moderator") {
      user.canUpload = true;
    } else if (role === "user") {
      user.canUpload = false;
    }

    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    next(error);
  }
};
// export const editSong = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { title, artist, duration, albumId } = req.body;
//     const imageFile = req.files?.imageFile;
//     const audioFile = req.files?.audioFile;

//     // Find the song and check if it's approved
//     const song = await Song.findById(id);
//     if (!song) {
//       return res.status(404).json({ message: "Song not found" });
//     }

//     if (song.status !== "approved") {
//       return res.status(403).json({ message: "Can only edit approved songs" });
//     }

//     // Check if user is the uploader or an admin/moderator
//     const user = await User.findOne({ clerkId: req.auth.userId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isAdminOrModerator = ["admin", "moderator"].includes(user.role);
//     if (
//       !isAdminOrModerator &&
//       song.uploadedBy.toString() !== user._id.toString()
//     ) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to edit this song" });
//     }

//     // Update fields
//     const updateData = {
//       title: title || song.title,
//       artist: artist || song.artist,
//       duration: duration || song.duration,
//     };

//     // Handle image update if provided
//     if (imageFile) {
//       const imageUrl = await uploadToCloudinary(imageFile);
//       updateData.imageUrl = imageUrl;
//     }

//     // Handle audio update if provided
//     if (audioFile) {
//       const audioUrl = await uploadToCloudinary(audioFile);
//       updateData.audioUrl = audioUrl;
//     }

//     // Handle album update if provided
//     if (albumId) {
//       const album = await Album.findById(albumId);
//       if (!album) {
//         return res.status(404).json({ message: "Album not found" });
//       }
//       updateData.albumId = albumId;
//     }

//     // Update the song
//     const updatedSong = await Song.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     res.status(200).json({
//       message: "Song updated successfully",
//       song: updatedSong,
//     });
//   } catch (error) {
//     console.error("Error in editSong:", error);
//     next(error);
//   }
// };
// export const editAlbum = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { title, artist, releaseYear } = req.body;
//     const imageFile = req.files?.imageFile;

//     // Find the album and check if it's approved
//     const album = await Album.findById(id);
//     if (!album) {
//       return res.status(404).json({ message: "Album not found" });
//     }

//     if (album.status !== "approved") {
//       return res.status(403).json({ message: "Can only edit approved albums" });
//     }

//     // Check if user is the uploader or an admin/moderator
//     const user = await User.findOne({ clerkId: req.auth.userId });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isAdminOrModerator = ["admin", "moderator"].includes(user.role);
//     if (
//       !isAdminOrModerator &&
//       album.uploadedBy.toString() !== user._id.toString()
//     ) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to edit this album" });
//     }

//     // Update fields
//     const updateData = {
//       title: title || album.title,
//       artist: artist || album.artist,
//       releaseYear: releaseYear || album.releaseYear,
//     };

//     // Handle image update if provided
//     if (imageFile) {
//       const imageUrl = await uploadToCloudinary(imageFile);
//       updateData.imageUrl = imageUrl;
//     }

//     // Update the album
//     const updatedAlbum = await Album.findByIdAndUpdate(id, updateData, {
//       new: true,
//     }).populate("songs");

//     res.status(200).json({
//       message: "Album updated successfully",
//       album: updatedAlbum,
//     });
//   } catch (error) {
//     console.error("Error in editAlbum:", error);
//     next(error);
//   }
// };