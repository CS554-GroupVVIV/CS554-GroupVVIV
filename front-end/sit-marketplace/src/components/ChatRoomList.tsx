import React, { useState, useEffect, useRef } from "react";
import { socketID, socket } from "./socket";

import ChatRoom from "./ChatRoom";

export default function ChatRoomList({ uid }) {
  const [rooms, setRooms] = useState({});
  const [curRoom, setCurRoom] = useState(undefined);

  useEffect(() => {
    socket.on("rooms", (data) => setRooms(data));
  }, [socket]);

  useEffect(() => {
    if (curRoom) {
      socket.emit("join room", {
        room: curRoom,
        user: uid,
      });
    }
  }, [curRoom]);

  if (Object.keys(rooms).length > 0) {
    return (
      <div>
        <div>
          <ul>
            {rooms &&
              Object.keys(rooms).map((room, i) => {
                return (
                  <li key={i}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        curRoom === room
                          ? setCurRoom(undefined)
                          : setCurRoom(room);
                      }}
                    >
                      {room}
                    </button>
                    <button
                      onClick={() => {
                        console.log(`Close btn for ${room} clicked.`);
                        if (curRoom !== room) {
                          socket.emit("join room", {
                            room: room,
                            user: uid,
                          });
                        }
                        socket.emit("leave");
                        setCurRoom(undefined);
                      }}
                    >
                      Close
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
        <div>{curRoom && <ChatRoom room={curRoom} />}</div>
      </div>
    );
  } else {
    return <h4>Nothing here...</h4>;
  }
}
