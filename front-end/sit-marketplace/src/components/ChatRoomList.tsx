import React, { useState, useEffect, useRef } from "react";
import { socketID, socket } from "./socket";

import { Grid, MenuList, MenuItem } from "@mui/material";

import { useQuery } from "@apollo/client";
import { GET_USERS_BY_IDS } from "../queries";

import ChatRoom from "./ChatRoom";

export default function ChatRoomList({ uid }) {
  const [rooms, setRooms] = useState({});
  const [curRoom, setCurRoom] = useState(undefined);

  const { loading, error, data } = useQuery(GET_USERS_BY_IDS, {
    variables: { ids: Object.keys(rooms) },
    fetchPolicy: "cache-and-network",
  });

  let participantDict = {};
  if (data) {
    for (const user of data.getUsersByIds) {
      participantDict[user._id] = user.firstname;
    }
  }

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

  // <button
  //   onClick={() => {
  //     if (curRoom !== room) {
  //       socket.emit("join room", {
  //         room: room,
  //         user: uid,
  //       });
  //     }
  //     socket.emit("leave");
  //     setCurRoom(undefined);
  //   }}
  // >
  //   Close
  // </button>;

  return (
    <div>
      <Grid
        container
        spacing={5}
        sx={{
          height: "90vh",
          width: "auto",
        }}
        direction="row"
      >
        <Grid item>
          <MenuList>
            {rooms && Object.keys(rooms).length > 0 ? (
              Object.keys(rooms).map((room, i) => {
                return (
                  <MenuItem
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      curRoom === room
                        ? setCurRoom(undefined)
                        : setCurRoom(room);
                    }}
                  >
                    {participantDict && participantDict[room]}
                  </MenuItem>
                );
              })
            ) : (
              <h4>Nothing here...</h4>
            )}
          </MenuList>
        </Grid>

        <Grid item xs sx={{ width: 500 }}>
          <div>{curRoom && <ChatRoom room={curRoom} />}</div>
        </Grid>
      </Grid>
    </div>
  );
}
