import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalAlbums,
      totalSongs,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const [
      uploadedSongs,
      pendingSongs,
      approvedSongs,
      rejectedSongs,

      uploadedAlbums,
      pendingAlbums,
      approvedAlbums,
      rejectedAlbums,
    ] = await Promise.all([
      Song.countDocuments({ uploadedBy: userId }),
      Song.countDocuments({ uploadedBy: userId, status: "pending" }),
      Song.countDocuments({ uploadedBy: userId, status: "approved" }),
      Song.countDocuments({ uploadedBy: userId, status: "rejected" }),

      Album.countDocuments({ uploadedBy: userId }),
      Album.countDocuments({ uploadedBy: userId, status: "pending" }),
      Album.countDocuments({ uploadedBy: userId, status: "approved" }),
      Album.countDocuments({ uploadedBy: userId, status: "rejected" }),
    ]);

    res.status(200).json({
      userId,
      songs: {
        total: uploadedSongs,
        statusBreakdown: {
          pending: pendingSongs,
          approved: approvedSongs,
          rejected: rejectedSongs,
        },
      },
      albums: {
        total: uploadedAlbums,
        statusBreakdown: {
          pending: pendingAlbums,
          approved: approvedAlbums,
          rejected: rejectedAlbums,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
