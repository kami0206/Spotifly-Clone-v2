import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
export const requireUploadPermission = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    if (!user.canUpload) {
      return res
        .status(403)
        .json({ message: "You do not have permission to upload music" });
    }

    next();
  } catch (error) {
    console.error("Upload permission error:", error);
    res
      .status(500)
      .json({ message: "Internal server error in upload permission" });
  }
};
export const updateUserPermissions = async (req, res, next) => {
  try {
    const { userId, role, canUpload } = req.body;

    const updateData = {};
    if (role && ["user", "moderator", "admin"].includes(role)) {
      updateData.role = role;
    }
    if (typeof canUpload === "boolean") {
      updateData.canUpload = canUpload;
    }

    const user = await User.findOneAndUpdate({ clerkId: userId }, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Permissions updated", user });
  } catch (error) {
    next(error);
  }
};

// GET users by role
export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const users = await User.find({ role });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
// export const getCurrentUser = async (req, res, next) => {
//   try {
//     // console.log("=== DEBUG getCurrentUser ===");
//     // console.log("req.auth:", req.auth);
//     // console.log("clerkId:", req.auth.userId);

//     const user = await User.findOne({ clerkId: req.auth.userId });
//     // console.log("Found user:", user);

//     // // Kiểm tra tất cả users trong DB
//     // const allUsers = await User.find({}).limit(5);
//     // console.log(
//     //   "All users in DB:",
//     //   allUsers.map((u) => ({ id: u._id, clerkId: u.clerkId }))
//     // );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ user });
//   } catch (error) {
//     next(error);
//   }
// };
