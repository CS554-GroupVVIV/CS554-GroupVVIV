import React, { useState, useEffect, useRef, useContext } from "react";

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
  const [chatHistory, setChatHistory] = useState([]);
  useEffect(() => {
    if (!loading) {
      if (!data) {
        const perfromAddChat = async (participants) => {
          await addChat({
            variables: {
              participants: participants,
            },
            refetchQueries: [
              {
                query: GET_CHAT_BY_PARTICIPANTS,
                variables: { participants: [currentUser.uid, room] },
              },
            ],
          });
        };
        try {
          perfromAddChat([currentUser.uid, room]);
        } catch (error) {
          console.error("Error adding chat:", error);
        }
      } else {
        // console.log("Chat Id: ", data.getChatByParticipants._id);

        const messages = data.getChatByParticipants.messages;
        // console.log(messages);
        if (messages) {
          setChatHistory(
            messages.map((message) => {
              return { sender: message.sender, message: message.message };
            })
          );
        }
      }
    }
  }, [loading, room]);

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
      console.error("Error adding user:", error);
    }
  };

  useEffect(() => {
    socket.on("message", ({ sender, room, message }) => {
      // console.log("The server has broadcast message data to all clients");

      setChat([...chat, { sender, message }]);
    });

    return () => {
      socket.off("message");
    };
  }, [chat, room]);

  useEffect(() => {
    setChat([]);
  }, [room]);

  const onMessageSubmit = (e) => {
    e.preventDefault();
    let msgEle = document.getElementById("message");

    // console.log("Going to send the message event to the server");
    socket.emit("message", {
      room: room,
      sender: currentUser.uid,
      message: msgEle.value,
    });

    const curDateTime = new Date();
    const msgData = {
      chatId: data.getChatByParticipants._id,
      sender: currentUser.uid,
      time: curDateTime.toISOString(),
      message: msgEle.value,
    };
    // console.log(msgData);
    handleAddMsg(msgData);

    msgEle.value = "";
    msgEle.focus();
  };

  return (
    <div>
      <h3>Chat Room with {room}:</h3>

      <h4 style={{ textAlign: "center" }}> --- History --- </h4>
      <Chat chat={chatHistory} participants={[currentUser.uid, room]} />

      <h4 style={{ textAlign: "center" }}> --- New --- </h4>
      <Chat chat={chat} participants={[currentUser.uid, room]} />

      <form
        className="chatform"
        autoComplete="false"
        onSubmit={onMessageSubmit}
      >
        <input
          name="message"
          id="message"
          variant="outlined"
          label="Message"
          autoFocus
        />

        <button>Send Message</button>
      </form>
    </div>
  );
}
