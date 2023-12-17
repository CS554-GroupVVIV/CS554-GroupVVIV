import React, { useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import ChatRoomList from "./ChatRoomList";

export default function ChatRoomListButton() {
  const { currentUser } = useContext(AuthContext);
  const [hidden, setHidden] = useState(true);
  console.log(hidden);

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
