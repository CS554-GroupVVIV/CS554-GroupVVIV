import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import app from "express";
import { createServer } from "http";
import { Server } from "socket.io"; //replaces (import socketIo from 'socket.io')

import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const { url } = await startStandaloneServer(server);

console.log(`🚀 Server ready at ${url}`);

// socket io:

// global list of available room
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // emit the initial list of available rooms
  socket.emit("rooms", rooms);

  socket.on("join room", ({ room, user }) => {
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
        admin: socket.id,
        users: {},
      };
    }

    // add user to room
    rooms[room].users[socket.id] = {
      username,
    };

    io.emit("rooms", rooms);
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
      io.emit("rooms", rooms);
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
      io.emit("rooms", rooms);
    }
    console.log("User disconnected:", socket.id);
  });

  socket.on("message", ({ room, sender, message }) => {
    console.log(`${sender} sent "${message}" to room: ${room}`);
    io.to(room).emit("message", { sender, message });
    // Place to write into mogodb
  });
});

httpServer.listen(4001, () => {
  console.log(`🚀 Socket.io server listening on http://localhost:4001/`);
});
