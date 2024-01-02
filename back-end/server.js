import https from "https";
import fs from "fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import app from "express";
import { createServer } from "http";
import { Server } from "socket.io"; //replaces (import socketIo from 'socket.io')
import redis from "redis";

import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

export const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
client.connect().then(() => {});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
let httpServer;
if (process.env.ENV == "PROD") {
  try {
    const credentials = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH, "utf8"),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH, "utf8"),
    };
    httpServer = https.createServer(credentials, app);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
} else {
  httpServer = createServer(app);
}

const io = new Server(httpServer, { cors: { origin: "*" } });

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.APOLLO_PORT || 4000 },
});

console.log(`🚀 Server ready at ${url}`);

// socket io:

// global list of available room

const globalRoom = [];

io.on("connection", (socket) => {
  const rooms = {};

  console.log("User connected", socket.id);

  // emit the initial list of available rooms
  socket.emit("rooms", rooms);

  socket.on("join room", ({ room, user }) => {
    if (room == user) {
      return;
    }
    if (socket.room) {
      socket.leave(socket.room);
      rooms[socket.room]--;
      if (rooms[socket.room] === 0) {
        delete rooms[socket.room];
      }
    }

    socket.join(room);
    socket.room = room;
    // console.log(socket.room);

    // get user name
    const username = user;
    socket.username = username;

    // room doesn't exist
    if (!rooms[room]) {
      rooms[room] = {
        // admin: socket.id,
        users: {},
      };
    }

    // add user to room
    rooms[room].users[socket.id] = {
      username,
    };

    socket.emit("rooms", rooms);
    console.log(`User ${socket.id} joined room ${room} as ${username}`);

    socket.emit("join room", { room, username });
  });

  socket.on("leave", () => {
    console.log(`${socket.id}: leave event for room ${socket.room} fired!`);

    if (socket.room) {
      socket.leave(socket.room);
      rooms[socket.room]--;
      if (!rooms[socket.room]) {
        delete rooms[socket.room];
      }
      socket.emit("rooms", rooms);
      console.log(`User ${socket.id} left room ${socket.room}`);
      socket.room = null;
    }
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      socket.leave(socket.room);
      rooms[socket.room]--;
      if (rooms[socket.room] === 0) {
        delete rooms[socket.room];
      }
      socket.emit("rooms", rooms);
    }

    console.log("User disconnected:", socket.id);
  });

  socket.on("message", ({ room, sender, message, time }) => {
    let roomId;
    if (room._id < sender._id) {
      roomId = room._id + "+" + sender._id;
    } else {
      roomId = sender._id + "+" + room._id;
    }
    if (!globalRoom.includes[roomId]) {
      globalRoom.push(roomId);
    }
    io.emit("global room", globalRoom);
    console.log(`${sender} sent "${message}" to room: ${room._id} at ${time}`);
    io.to(room._id).emit("message", { room, sender, message, time });
    io.to(sender._id).emit("message", { sender, room, message, time });

    // Place to write into mogodb
  });
});

httpServer.listen(process.env.SOCKETIO_PORT || 4001, () => {
  console.log(`🚀 Socket.io server listening on http://localhost:4001/`);
});
