import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

// import './App.css';
import Chat from "./Chat";

import { useQuery } from "@apollo/client";
import { GET_CHAT_BY_PARTICIPANTS } from "../queries";

export default function Chatbox() {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

  const [state, setState] = useState({
    message: "",
    sender: userId,
  });
  const [chat, setChat] = useState([]);
  const socketRef = useRef();

  const { loading, error, data } = useQuery(GET_CHAT_BY_PARTICIPANTS, {
    variables: { participants: [userId] },
    fetchPolicy: "cache-and-network",
  });

  const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false);
  const [participants, setParticipants] = useState(undefined);

  useEffect(() => {
    if (!loading) {
      if (error) {
        console.log(error);
      } else {
        setParticipants(data.getChatByParticipants.participants);

        if (!chatHistoryLoaded) {
          const chatHistory = data.getChatByParticipants.messages;
          // console.log(chatHistory);
          chatHistory &&
            chatHistory.map((message) => {
              // console.log(message.sender, message.message);
              setChat([
                ...chat,
                {
                  sender: message.sender,
                  message: message.message,
                },
              ]);
            });
          setChatHistoryLoaded(true);
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
    socketRef.current.on("message", ({ sender, message }) => {
      console.log("The server has broadcast message data to all clients");
      setChat([...chat, { sender, message }]);
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
    let msgEle = document.getElementById("message");

    const curDateTime = new Date();
    const msgData = {
      sender: userId,
      time: curDateTime.toISOString(),
      message: msgEle.value,
    };
    // console.log([msgEle.name], msgEle.value);
    console.log(msgData);

    setState({ ...state, [msgEle.name]: msgEle.value });
    console.log("Going to send the message event to the server");
    socketRef.current.emit("message", {
      sender: userId,
      message: msgEle.value,
    });
    e.preventDefault();
    setState({ message: "", sender: userId });
    msgEle.value = "";
    msgEle.focus();
  };

  return (
    <div>
      {state.sender && (
        <div className="card">
          <div className="render-chat">
            <h1>Chat Log</h1>
            <Chat chat={chat} participants={participants} />
          </div>
          <form className="chatform" onSubmit={onMessageSubmit}>
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
