const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const {
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
} = require("./rooms");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 New connection: ${socket.id}`);

  // 👇 Modified to handle creator
  socket.on("join-room", ({ roomId, username, isCreator = false }) => {
    socket.join(roomId);
    addUserToRoom(roomId, { id: socket.id, username }, isCreator);

    socket.to(roomId).emit("user-joined", { id: socket.id, username });
    socket.emit("room-users", getRoomUsers(roomId));
    console.log(`✅ ${username} joined room ${roomId}`);
  });

  socket.on("drawing", ({ roomId, data }) => {
    socket.to(roomId).emit("drawing", data);
  });

  socket.on("erase", ({ roomId, data }) => {
    socket.to(roomId).emit("erase", data);
  });

  socket.on("chat", ({ roomId, username, message }) => {
    socket.to(roomId).emit("chat", { username, message });
  });

  socket.on("signal", ({ roomId, signalData }) => {
    socket.to(roomId).emit("signal", { from: socket.id, signalData });
  });

  socket.on("disconnect", () => {
    const result = removeUserFromRoom(socket.id);
    if (result) {
      const { roomId, user, deletedRoom } = result;

      if (deletedRoom) {
        io.to(roomId).emit("room-closed");
        console.log(`❌ Room ${roomId} deleted (owner ${user.username} left)`);
      } else {
        socket.to(roomId).emit("user-left", {
          id: socket.id,
          username: user.username,
        });
        console.log(`❌ ${user.username} left room ${roomId}`);
      }
    }
  });
});

app.get("/", (req, res) => {
  res.send("CoolLaboratool backend is running.");
});

server.listen(3001, () => {
  console.log("🚀 Server listening on http://localhost:3001");
});
