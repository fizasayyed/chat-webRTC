"use strict";

var express = require("express");

var http = require("http");

var socketIO = require("socket.io");

var cors = require("cors");

var app = express();
app.use(cors({
  origin: "https://sneakspeak.vercel.app",
  methods: "*",
  allowedHeaders: "*",
  credentials: true
}));
var server = http.createServer(app);
var io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: "*",
    allowedHeaders: "*",
    credentials: true,
    transports: ['websocket', 'polling']
  },
  allowEIO3: true
});
io.on("connection", function (socket) {
  console.log("A user connected"); // WebRTC signaling events

  socket.on("offer", function (offer) {
    socket.broadcast.emit("offer", offer);
  });
  socket.on("answer", function (answer) {
    socket.broadcast.emit("answer", answer);
  });
  socket.on("candidate", function (candidate) {
    socket.broadcast.emit("candidate", candidate);
  }); // Chat functionality

  socket.on("message", function (message) {
    var messageWithSender = {
      text: message.text,
      sender: socket.id,
      // Include sender information
      username: message.username,
      avatar: message.avatar
    };
    console.log("Received message: ", messageWithSender); // Broadcast the message to all other connected clients

    socket.broadcast.emit("message", messageWithSender);
  });
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});
var HOST = "localhost";
var PORT = "4000";
server.listen(PORT, HOST, function () {
  console.log("Server is listening on http://".concat(HOST, ":").concat(PORT));
});