import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

// import './App.css';
import Chat from "./Chat";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CHAT_BY_PARTICIPANTS, ADD_MESSAGE } from "../queries";

export default function Chatbox() {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

  const [state, setState] = useState({
    sender: userId,
    message: "",
  });
  const [chat, setChat] = useState([]);
  const socketRef = useRef();

  const { loading, error, data } = useQuery(GET_CHAT_BY_PARTICIPANTS, {
    variables: { participants: [userId] },
    fetchPolicy: "cache-and-network",
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [participants, setParticipants] = useState(undefined);

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
    if (!loading) {
      if (error) {
        console.log(error);
      } else {
        console.log("Chat Id: ", data.getChatByParticipants._id);
        setParticipants(data.getChatByParticipants.participants);

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
  }, [loading]);

  useEffect(() => {
    socketRef.current = io("http://localhost:4001");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("message", ({ name, message }) => {
      console.log("The server has broadcast message data to all clients");
      setChat([...chat, { sender: name, message: message }]);
    });
    socketRef.current.on("user_join", function (data) {
      console.log("The server has broadcast user join event to all clients");
      setChat([
        ...chat,
        { sender: "ChatBot", message: `${data} has joined the chat` },
      ]);
    });

    return () => {
      socketRef.current.off("message");
      socketRef.current.off("user_join");
    };
  }, [chat]);

  const userjoin = (currentUser) => {
    console.log("Going to send the user join event to the server");
    socketRef.current.emit("user_join", currentUser);
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    let msgEle = document.getElementById("message");

    console.log("Going to send the message event to the server");
    console.log("Sender:", userId, ", Message:", msgEle.value);
    socketRef.current.emit("message", {
      name: userId,
      message: msgEle.value,
    });

    const curDateTime = new Date();
    const msgData = {
      chatId: data.getChatByParticipants._id,
      sender: userId,
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
      {state.sender && (
        <div className="card">
          <div className="render-chat">
            <h1>Chat Log</h1>

            <h2>History:</h2>
            <Chat chat={chatHistory} participants={participants} />

            <br></br>
            <h2>New:</h2>
            <Chat chat={chat} participants={participants} />
          </div>
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
      )}

      {/* {!state.name && (
        <form
          className="usernameform"
          onSubmit={(e) => {
            console.log(document.getElementById("username_input").value);
            e.preventDefault();
            setState({ name: document.getElementById("username_input").value });
            userjoin(document.getElementById("username_input").value);
            // userName.value = '';
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input id="username_input" />
            </label>
          </div>
          <br />

          <br />
          <br />
          <button type="submit"> Click to join</button>
        </form>
      )} */}
    </div>
  );
}
