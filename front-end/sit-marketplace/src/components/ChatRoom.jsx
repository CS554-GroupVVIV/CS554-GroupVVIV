import React, { useState, useEffect, useContext, useRef } from "react";

import { socket } from "./socket";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CHAT_BY_PARTICIPANTS, ADD_MESSAGE, ADD_CHAT } from "../queries";

import { AuthContext } from "../context/AuthContext";

import Chat from "./Chat";

import { Grid, Button, TextField, Divider } from "@mui/material";
import { rootShouldForwardProp } from "@mui/material/styles/styled";

export default function ChatRoom({ room, name }) {
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const { loading, error, data } = useQuery(GET_CHAT_BY_PARTICIPANTS, {
    variables: { participants: [currentUser?.uid, room] },
    fetchPolicy: "cache-and-network",
  });

  const [addChat] = useMutation(ADD_CHAT);

  useEffect(() => {
    if (currentUser && data && !data.getChatByParticipants) {
      try {
        addChat({
          variables: {
            participants_id: [currentUser.uid, room],
          },
          refetchQueries: [
            {
              query: GET_CHAT_BY_PARTICIPANTS,
              variables: { participants: [currentUser.uid, room] },
            },
          ],
        });
      } catch (error) {
        alert("Error adding chat:", error);
      }
    }
  }, [data]);

  const [chat, setChat] = useState([]);
  const [addMsg] = useMutation(ADD_MESSAGE);
  const handleAddMsg = async (msgData) => {
    try {
      await addMsg({
        variables: {
          chatId: msgData.chatId,
          sender_id: msgData.sender._id,
          message: msgData.message,
          time: msgData.time,
        },
      });
    } catch (error) {
      alert("Error adding user:", error);
    }
  };

  const messagesEndRef = useRef(null);
  useEffect(() => {
    socket.on("message", ({ room, sender, message, time }) => {
      if (sender._id == currentUser.uid || room._id == currentUser.uid) {
        setChat([...chat, { sender, message, time }]);
      }
    });

    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });

    return () => {
      socket.off("message");
    };
  }, [chat]);

  useEffect(() => {
    setChat([]);

    if (room) {
      socket.emit("join room", {
        room: room,
        user: currentUser.uid,
      });
    }
  }, [room]);

  if (data && data.getChatByParticipants) {
    return (
      <Grid container direction={"column"}>
        <Grid
          item
          height={"60vh"}
          sx={{ overflowY: "auto", border: 2 }}
          mt={1}
          mb={1}
          pl={2}
          pr={2}
        >
          <Chat chat={data && data.getChatByParticipants.messages} />

          {chat.length > 0 && (
            <>
              <Divider />
              <p>New Messages:</p>
            </>
          )}
          <Chat chat={chat} />

          <div ref={messagesEndRef} />
        </Grid>

        <Grid item sx={{ padding: 1 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TextField
              variant="outlined"
              label="message"
              value={message}
              onInput={(e) => setMessage(e.target.value)}
              autoFocus
              inputProps={{ maxLength: 200 }}
              autoComplete="off"
              InputLabelProps={{
                sx: {
                  // fontFamily: "monospace",
                  fontWeight: "bold",
                },
              }}
              style={{
                // fontFamily: "monospace",
                fontWeight: "bold",
                color: "#424242",
              }}
              sx={{ width: "80%" }}
            />
            <Button
              variant="contained"
              // color="inherit"
              onClick={(event) => {
                event.preventDefault();
                const msgData = {
                  sender: {
                    _id: currentUser.uid,
                    firstname: currentUser.displayName,
                  },
                  time: new Date().toISOString(),
                  message: message,
                  chatId: data.getChatByParticipants._id,
                };

                socket.emit("message", {
                  room: {
                    _id: room,
                    firstname: name,
                  },
                  sender: msgData.sender,
                  message: msgData.message,
                  time: msgData.time,
                });

                handleAddMsg(msgData);

                setMessage("");
              }}
              sx={{ marginLeft: 1 }}
            >
              Send
            </Button>
          </div>
        </Grid>
      </Grid>
    );
  }
}
