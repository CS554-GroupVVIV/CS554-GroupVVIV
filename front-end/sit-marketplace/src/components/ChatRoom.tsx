import React, { useState, useEffect, useContext } from "react";

import { socketID, socket } from "./socket";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CHAT_BY_PARTICIPANTS, ADD_CHAT, ADD_MESSAGE } from "../queries";

import { AuthContext } from "../context/AuthContext";

import Chat from "./Chat";

export default function ChatRoom({ room }) {
  const { currentUser } = useContext(AuthContext);

  const { loading, error, data } = useQuery(GET_CHAT_BY_PARTICIPANTS, {
    variables: { participants: [currentUser.uid, room] },
    fetchPolicy: "cache-and-network",
  });

  const [addChat] = useMutation(ADD_CHAT);

  useEffect(() => {
    if (!loading) {
      if (!data) {
        try {
          addChat({
            variables: {
              participants: [currentUser.uid, room],
            },
            refetchQueries: [
              {
                query: GET_CHAT_BY_PARTICIPANTS,
                variables: { participants: [currentUser.uid, room] },
              },
            ],
          });
        } catch (error) {
          console.error("Error adding chat:", error);
        }
      }
    }
  }, [loading]);

  const [chat, setChat] = useState([]);
  const [addMsg] = useMutation(ADD_MESSAGE);
  const handleAddMsg = async (msgData) => {
    try {
      console.log("adding...", msgData);
      await addMsg({
        variables: {
          chatId: msgData.chatId,
          sender: msgData.sender,
          message: msgData.message,
          time: msgData.time,
        },
      });
      console.log("added");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  useEffect(() => {
    socket.on("message", ({ sender, message, time }) => {
      // console.log("The server has broadcast message data to all clients");
      setChat([...chat, { sender, message, time }]);
    });

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

  if (!loading) {
    return (
      <div>
        <h3>Chat Room with {room}:</h3>

        {/* <h4 style={{ textAlign: "center" }}> --- History --- </h4> */}
        <Chat
          chat={data && data.getChatByParticipants.messages}
          participants={[currentUser.uid, room]}
        />

        {/* <h4 style={{ textAlign: "center" }}> --- New --- </h4> */}
        <Chat chat={chat} participants={[currentUser.uid, room]} />

        <form
          className="chatform"
          autoComplete="false"
          onSubmit={(e) => {
            e.preventDefault();

            let msgEle = document.getElementById("message");
            const msgData = {
              sender: currentUser.uid,
              time: new Date().toISOString(),
              message: msgEle.value,
              chatId: data.getChatByParticipants._id,
            };

            socket.emit("message", {
              room: room,
              sender: msgData.sender,
              message: msgData.message,
              time: msgData.time,
            });

            // console.log(msgData);
            handleAddMsg(msgData);

            msgEle.value = "";
            msgEle.focus();
          }}
        >
          <input
            name="message"
            id="message"
            variant="outlined"
            label="Message"
            autoFocus
            autoComplete="false"
          />

          <button>Send</button>
        </form>
      </div>
    );
  }
}
