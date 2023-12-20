import React, { useState, useEffect, useContext } from "react";

import { socketID, socket } from "./socket";

import { AuthContext } from "../context/AuthContext";
import ChatRoomList from "./ChatRoomList";

export default function ChatRoomListButton() {
  const { currentUser } = useContext(AuthContext);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    socket.on("join room", () => {
      setHidden(false);
    });
  }, [socket]);

  if (currentUser) {
    return (
      <>
        <button
          onClick={() => {
            hidden ? setHidden(false) : setHidden(true);
          }}
        >
          ChatRooms
        </button>
        <div hidden={hidden}>
          <ChatRoomList uid={currentUser.uid} />
        </div>
      </>
    );
  }
}
