import React, { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import { useQuery } from "@apollo/client";
import { GET_USERS_BY_IDS } from "../queries";

export default function Chat({ chat, participants }) {
  const { currentUser } = useContext(AuthContext);

  const { loading, error, data } = useQuery(GET_USERS_BY_IDS, {
    variables: { ids: participants },
    fetchPolicy: "cache-and-network",
  });

  let participantDict = {};
  if (data) {
    for (const user of data.getUsersByIds) {
      participantDict[user._id] = user.firstname;
    }
    // }

    // if (!loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {chat &&
          chat.map(({ sender, message, time }, index) => (
            <div
              key={index}
              style={{
                alignSelf:
                  sender === currentUser.uid ? "flex-end" : "flex-start",
                maxWidth: "70%",
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                {participantDict && participantDict[sender]}:
              </p>
              <p
                style={{
                  padding: 10,
                  backgroundColor:
                    sender === currentUser.uid ? "blue" : "green",
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
}
