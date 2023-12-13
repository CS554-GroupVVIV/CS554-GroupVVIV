import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

import ChatRoom from "./ChatRoom";

export default function ChatRoomList() {
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

  const [rooms, setRooms] = useState({});
  const [curRoom, setCurRoom] = useState(undefined);

  if (Object.keys(rooms).length > 0) {
    return (
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Close All
        </button>
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
                      onClick={(e) => {
                        e.preventDefault();
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
