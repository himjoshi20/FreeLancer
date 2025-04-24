require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Import Models & Routes
const { User, ServiceRequest, Chat, Agreement } = require("./models");
const authRoutes = require("./Routes/auth");
const profileRoutes = require("./Routes/profile");
const matchRoutes = require("./Routes/match");
const serviceRoutes = require("./Routes/service");

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Setup Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/service", serviceRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Freelancer Skill Exchange Backend is Running! 🚀");
});

// ✅ Socket.io Event Handling
io.on("connection", (socket) => {
  console.log(`🟢 User Connected: ${socket.id}`);

  // ✅ User joins a chat room for a specific service request
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // ✅ When a user sends a message
  socket.on("sendMessage", ({ roomId, message, sender }) => {
    const newMessage = { message, sender, timestamp: new Date() };
    
    // Emit message to all users in the room
    io.to(roomId).emit("receiveMessage", newMessage);
  });

  // ✅ Handle User Disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
