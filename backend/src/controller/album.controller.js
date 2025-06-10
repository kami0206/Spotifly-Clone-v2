import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find({ status: "approved" });
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    // const currentUser = await clerkClient.users.getUser(req.auth.userId);
    // const isAdmin =
    //   process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    const album = await Album.findById(albumId).populate({
      path: "songs",
      match: { status: "approved" }, // Only approved songs for non-admins  isAdmin ? {} :
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
  // try {
  //       const {albumId} = req.params;

  //       const album = await Album.findById(albumId).populate('songs');

  //       if (!album) {
  //           return res.status(404).json({message: 'Album not found'});
  //       }

  //       res.status(200).json(album);
  //   } catch (error) {
  //       next(error);
  //   }
};

export const getAlbumsByUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      console.log("Backend: User not found for clerkId:", id);
      return res.status(404).json({ message: "User not found" });
    }

    // Find all albums uploaded by this user
    const albums = await Album.find({ uploadedBy: user._id })
      .populate("songs")
      .sort({ createdAt: -1 });

    console.log("Found albums for user:", albums.length);

    res.status(200).json({ albums }); // Always wrap in an object with albums property
  } catch (error) {
    console.error("Error in getAlbumsByUser:", error);
    next(error);
  }
};

export const getPendingAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "fullName") // if you have uploadedBy field
      .populate("songs", "title status"); // if you want to get the list of songs in the album

    console.log("Pending albums:", albums);

    res.status(200).json({ albums });
  } catch (error) {
    console.error("Error in getPendingAlbums:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching pending albums" });
  }
};
