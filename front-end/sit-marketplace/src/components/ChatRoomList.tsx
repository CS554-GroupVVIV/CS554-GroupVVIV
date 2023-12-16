import React, { useState, useEffect, useRef } from "react";
import { socketID, socket } from "./socket";

import ChatRoom from "./ChatRoom";

export default function ChatRoomList({ uid }) {
  const [rooms, setRooms] = useState({});
  const [curRoom, setCurRoom] = useState(undefined);

  useEffect(() => {
    socket.on("rooms", (data) => {
      setRooms(data);
    });

    // socket.on("join room", (data) => {
    //   if (curRoom !== data.room) setCurRoom(data.room);
    // });

    for (const key in rooms) {
      if (rooms[key] !== null) {
        setCurRoom(key);
      }
    }
  }, [socket]);

  useEffect(() => {
    if (curRoom) {
      socket.emit("join room", {
        room: curRoom,
        user: uid,
      });
    }
  }, [curRoom]);

  return (
    <div>
      <h2>Active Chat Room List:</h2>

      {rooms && Object.keys(rooms).length > 0 ? (
        <ul>
          {Object.keys(rooms).map((room, i) => {
            return (
              <li key={i}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    curRoom === room ? setCurRoom(undefined) : setCurRoom(room);
                  }}
                >
                  {room}
                </button>
                <button
                  onClick={() => {
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
      ) : (
        <h4>Nothing here...</h4>
      )}

      <div>{curRoom && <ChatRoom room={curRoom} />}</div>
    </div>
  );
}
