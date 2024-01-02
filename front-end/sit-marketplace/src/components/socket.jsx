import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.VITE_SOCKETIO_URL ||
    "https://sit-marketplace-chat-79d2c7772fa9.herokuapp.com/"
);
let socketID = "";
socket.on("connect", () => {
  socketID = socket.id;
});
