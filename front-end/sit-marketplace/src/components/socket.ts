import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKETIO_URL || "http://localhost:4001");
export let socketID = "";
socket.on("connect", () => {
  socketID = socket.id;
});
