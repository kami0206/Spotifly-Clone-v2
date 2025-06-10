import { User } from "../models/user.model.js";
import { clerkClient } from "@clerk/express";

export const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;
    const clerkUser = await clerkClient.users.getUser(id);

    if (!clerkUser) {
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại trên Clerk" });
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress;
    const fullName = `${clerkUser.firstName || firstName || ""} ${
      clerkUser.lastName || lastName || ""
    }`.trim();
    const userImageUrl = clerkUser.imageUrl || imageUrl;
    const username = clerkUser.username;

    if (!email) {
      throw new Error("Không có email trong user");
    }

    const isAdmin =
      email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

    let user = await User.findOne({ clerkId: id });

    if (!user) {
      const userData = {
        clerkId: id,
        fullName: fullName || email.split("@")[0],
        imageUrl: userImageUrl,
        role: isAdmin ? "admin" : "user",
        canUpload: isAdmin,
        // email,
        username,
      };

      console.log("Tạo user mới:", userData);

      user = await User.create(userData);
      console.log("Tạo thành công:", user);
    } else {
      // Cập nhật nếu thiếu thông tin
      const updateData = {};

      if (!user.fullName && fullName) updateData.fullName = fullName;
      if (!user.imageUrl && userImageUrl) updateData.imageUrl = userImageUrl;
      // if (!user.email && email) updateData.email = email;
      if (!user.username && username) updateData.username = username;

      if (Object.keys(updateData).length > 0) {
        user = await User.findOneAndUpdate({ clerkId: id }, updateData, {
          new: true,
        });
        console.log("Cập nhật user:", user);
      } else {
        console.log("User đã có đầy đủ thông tin:", user);
      }
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Lỗi trong authCallback:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      clerkId: req.body?.id || "unknown",
    });
  }
};
