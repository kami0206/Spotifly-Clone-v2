import { clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ clerkId: req.auth.userId });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied - Admins only" });
    }

    next();
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    next(error);
  }
};
export const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ clerkId: req.auth.userId });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: `Access denied - Requires one of: ${roles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      next(error);
    }
  };
};

export const requireModeratorOrAdmin = async (req, res, next) => {
  const user = await User.findOne({ clerkId: req.auth.userId });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!["moderator", "admin"].includes(user.role)) {
    return res
      .status(403)
      .json({
        message: "Access denied - only moderators and admins can approve songs",
      });
  }

  next();
};
