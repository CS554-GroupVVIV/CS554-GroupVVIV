import React, { useState, useEffect, useRef } from "react";
import { socket } from "./socket";

import { Grid, MenuList, MenuItem, Button, Stack } from "@mui/material";

import { useQuery } from "@apollo/client";
import { GET_USERS_BY_IDS } from "../queries";

import ChatRoom from "./ChatRoom";
import RatingProfile from "./Rating";

export default function ChatRoomList({ uid }) {
  const [rooms, setRooms] = useState({});
  const [curRoom, setCurRoom] = useState(undefined);

  if (rooms) {
    console.log(rooms);
    var { loading, error, data } = useQuery(GET_USERS_BY_IDS, {
      variables: { ids: Object.keys(rooms) },
      fetchPolicy: "cache-and-network",
    });
  }

  let participantDict = {};
  if (data) {
    for (const user of data.getUsersByIds) {
      participantDict[user._id] = user.firstname;
    }
  }

  // useEffect(() => {
  //   socket.emit("rooms");
  // }, []);

  useEffect(() => {
    socket.on("global room", (data) => {
      data.map((chat) => {
        if (chat.split("+")[0] == uid || chat.split("+")[1] == uid) {
          let myroom;
          if (chat.split("+")[0] == uid) {
            myroom = chat.split("+")[1];
          } else {
            myroom = chat.split("+")[0];
          }
          socket.emit("join room", {
            room: myroom,
            user: uid,
          });
        }
      });
    });

    socket.on("rooms", (data) => {
      setRooms(data);
    });
  }, [socket]);

  // socket.on("join room", (data) => {
  //   setCurRoom(data.room);
  // });
  useEffect(() => {
    let cur = undefined;
    for (const key in rooms) {
      if (rooms[key]) {
        cur = key;
        break;
      }
    }
    setCurRoom(cur);
  }, [rooms]);

  useEffect(() => {
    if (curRoom) {
      socket.emit("join room", {
        room: curRoom,
        user: uid,
      });
    }
  }, [curRoom]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "right" }}>
        {curRoom && (
          <Stack spacing={2} direction="row">
            <RatingProfile id={curRoom} />
            <Button
              size="small"
              variant="contained"
              // color="inherit"
              onClick={() => {
                socket.emit("leave");
                setCurRoom(undefined);
              }}
            >
              Close connection with{" "}
              {participantDict && participantDict[curRoom]}
            </Button>
          </Stack>
        )}
      </div>

      <Grid
        container
        spacing={3}
        sx={{
          height: "100%",
          width: "auto",
          overflowY: "hidden",
        }}
        // sx={{ overflowY: "hidden" }}
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
                    sx={
                      curRoom === room
                        ? { fontWeight: "bold", marginBottom: 1, border: 2 }
                        : { fontWeight: "bold", marginBottom: 1 }
                    }
                  >
                    {participantDict && participantDict[room]}
                  </MenuItem>
                );
              })
            ) : (
              <p>Nothing here...</p>
            )}
          </MenuList>
        </Grid>
        <Grid item xs sx={{ width: 500 }}>
          {curRoom && (
            <ChatRoom room={curRoom} name={participantDict[curRoom]} />
          )}
        </Grid>
      </Grid>
    </>
  );
}
