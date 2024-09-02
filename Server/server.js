import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const PORT = 3000;
const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your client origin
    methods: ["GET", "POST"] // Include both GET and POST methods
  }
});

// When a client connects
io.on("connection", (socket) => {
  console.log("A new client connected:", socket.id);

  // Handle join room event
  socket.on("join_room", (room) => {
    socket.join(room); // User joins the specified room
    console.log(`User Id - ${socket.id} Joined Room - ${room}`);
  });

  // Handle send message event
  socket.on("send_message", (messageData) => {
    console.log(`Message from ${messageData.user} in Room ${messageData.room}: ${messageData.message}`);
    // Broadcast the message to all other clients in the room
    socket.to(messageData.room).emit("receive_message", messageData);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

// Apply CORS middleware to Express
app.use(cors());

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
