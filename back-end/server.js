import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import app from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io'; //replaces (import socketIo from 'socket.io')

import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {origin: '*'}});

const { url } = await startStandaloneServer(server);

console.log(`🚀 Server ready at ${url}`);


io.on('connection', (socket) => {
  console.log('new client connected', socket.id);

  socket.on('user_join', (name) => {
    console.log('A user joined their name is ' + name);
    socket.broadcast.emit('user_join', name);
  });

  socket.on('message', ({name, message}) => {
    console.log(name, message, socket.id);
    io.emit('message', {name, message});
    // Place to write into mogodb
  });

  socket.on('disconnect', () => {
    console.log('Disconnect Fired');
  });
});

httpServer.listen(4001, () => {
  console.log(`🚀 Socket.io server listening on http://localhost:4001/`);
});