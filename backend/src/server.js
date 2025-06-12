import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import cron from "node-cron";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

import userRoutes from "./routers/user.route.js";
import adminRoutes from "./routers/admin.route.js";
import authRoutes from "./routers/auth.route.js";
import songRoutes from "./routers/song.route.js";
import albumRoutes from "./routers/album.route.js";
import statRoutes from "./routers/stat.route.js";
import playlistRouter from "./routers/playlist.route.js";
dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); //to parse req.body
app.use(clerkMiddleware()); // this will add auth to res obj => req.auth.userId

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, //10MB max file size
    },
  })
);

const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});

cron.schedule("0 0 * * *", async () => {
  try {
    await Song.deleteMany({
      status: "pending",
      createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    console.log("Deleted old unapproved songs");
  } catch (error) {
    console.error("Error deleting unapproved songs:", error);
  }
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/playlists", playlistRouter);



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

httpServer.listen(PORT, () => {
  console.log("server running on port " + PORT);
  connectDB();
});
