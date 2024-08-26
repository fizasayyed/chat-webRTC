const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const app = express();

app.use(cors({
  origin: "https://sneakspeak.vercel.app",
  methods: "*",
  allowedHeaders: "*",
  credentials: true
}));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "https://sneakspeak.vercel.app",
    methods: "*",
    allowedHeaders: "*",
    credentials: true,
    transports: ['websocket', 'polling']
  },
  allowEIO3: true
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // WebRTC signaling events
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("candidate", candidate);
  });

  // Chat functionality
  socket.on("message", (message) => {
    const messageWithSender = {
      text: message.text,
      sender: socket.id, // Include sender information
      username: message.username,
      avatar: message.avatar
    };
    console.log("Received message: ", messageWithSender);
    // Broadcast the message to all other connected clients
    socket.broadcast.emit("message", messageWithSender);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const HOST = "localhost";
const PORT = "4000";

server.listen(PORT, HOST, () => {
  console.log(`Server is listening on http://${HOST}:${PORT}`);
});