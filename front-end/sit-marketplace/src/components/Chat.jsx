import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Chat({ chat }) {
  const { currentUser } = useContext(AuthContext);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {chat &&
        chat.map(({ sender, message, time }, index) => (
          <div
            key={index}
            style={{
              alignSelf:
                sender._id === currentUser.uid ? "flex-end" : "flex-start",
              maxWidth: "70%",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
              }}
            >
              {sender.firstname}:
            </p>
            <p
              style={{
                padding: 10,
                backgroundColor:
                  sender._id === currentUser.uid ? "blue" : "green",
                borderRadius: 20,
                color: "white",
              }}
            >
              {message}
            </p>
            <p>{new Date(time).toLocaleString()}</p>
          </div>
        ))}
    </div>
  );
}
