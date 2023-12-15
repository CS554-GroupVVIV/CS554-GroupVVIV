import { io } from "socket.io-client";

export const socket = io(process.env.SOCKETIO_URL || "http://localhost:4001");
export let socketID = "";
socket.on("connect", () => {
  socketID = socket.id;
});
