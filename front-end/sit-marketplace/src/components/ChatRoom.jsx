import React, { useState, useEffect, useContext, useRef } from "react";

import { socket } from "./socket";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CHAT_BY_PARTICIPANTS, ADD_CHAT, ADD_MESSAGE } from "../queries";

import { AuthContext } from "../context/AuthContext";

import Chat from "./Chat";

import { Grid, Button, TextField, Divider } from "@mui/material";

export default function ChatRoom({ room }) {
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const { loading, error, data } = useQuery(GET_CHAT_BY_PARTICIPANTS, {
    variables: { participants: [currentUser?.uid, room] },
    fetchPolicy: "cache-and-network",
  });

  const [addChat] = useMutation(ADD_CHAT);

  useEffect(() => {
    if (!loading) {
      if (!data && currentUser) {
        try {
          addChat({
            variables: {
              participants: [currentUser?.uid, room],
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
    }
  }, [loading]);

  const [chat, setChat] = useState([]);
  const [addMsg] = useMutation(ADD_MESSAGE);
  const handleAddMsg = async (msgData) => {
    try {
      await addMsg({
        variables: {
          chatId: msgData.chatId,
          sender: msgData.sender,
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
    socket.on("message", ({ sender, message, time }) => {
      setChat([...chat, { sender, message, time }]);
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
        <Chat
          chat={data && data.getChatByParticipants.messages}
          participants={[currentUser?.uid, room]}
        />

        {chat.length > 0 && (
          <>
            <Divider />
            <p>New Messages:</p>
          </>
        )}
        <Chat chat={chat} participants={[currentUser?.uid, room]} />

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
                sender: currentUser.uid,
                time: new Date().toISOString(),
                message: message,
                chatId: data.getChatByParticipants._id,
              };

              socket.emit("message", {
                room: room,
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
