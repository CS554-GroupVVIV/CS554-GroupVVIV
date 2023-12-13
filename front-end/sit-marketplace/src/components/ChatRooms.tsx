import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import ChatRoom from "./ChatRoom";

export default function RoomList() {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:4001");

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("rooms", (data) => setRooms(data));
  }, [socketRef.current]);

  const [rooms, setRooms] = useState([]);
  const [curRoom, setCurRoom] = useState(undefined);

  return (
    <div>
      <h2>Room List:</h2>
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
                </li>
              );
            })}
        </ul>
      </div>
      <div>{curRoom && <ChatRoom room={curRoom} />}</div>
    </div>
  );
}
