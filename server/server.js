// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: `/uploads/${req.file.filename}` });
});

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("Chat API Running"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

const onlineUsers = new Map();
const typingUsers = new Set();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    socket.user = { id: payload.id, username: payload.username };
    next();
  } catch (e) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const user = socket.user;
  onlineUsers.set(user.id, { socketId: socket.id, username: user.username });
  io.emit("user-online", { userId: user.id, username: user.username });

  socket.on("join-room", (room) => {
    socket.join(room);
    socket.to(room).emit("notification", `${user.username} joined ${room}`);
  });

  socket.on("send-message", ({ room, message, type = "text", file }) => {
    const msg = {
      id: Date.now() + Math.random(),
      sender: user.username,
      message,
      type,
      file,
      timestamp: new Date(),
    };
    io.to(room).emit("receive-message", msg);
  });

  socket.on("typing", ({ room, isTyping }) => {
    if (isTyping) typingUsers.add(user.username);
    else typingUsers.delete(user.username);
    socket.to(room).emit("typing", { username: user.username, isTyping });
  });

  socket.on("private-message", ({ to, message }) => {
    const recipient = Array.from(onlineUsers.values()).find(u => u.username === to);
    if (recipient) {
      socket.to(recipient.socketId).emit("private-message", {
        from: user.username,
        message,
        timestamp: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(user.id);
    io.emit("user-offline", { userId: user.id });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));