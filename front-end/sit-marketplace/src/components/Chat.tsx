import React, { useEffect, useRef, useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import { useQuery } from "@apollo/client";
import { GET_USERS_BY_IDS } from "../queries";

export default function Chat({ chat, participants }) {
  const { currentUser } = useContext(AuthContext);

  const [participantDict, setParticipantDict] = useState({});

  const { loading, error, data } = useQuery(GET_USERS_BY_IDS, {
    variables: { ids: participants },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!loading && !error) {
      const users = data.getUsersByIds;
      users &&
        users.map((user) => {
          // console.log(user._id, user.firstname);
          setParticipantDict((prev) => ({
            ...prev,
            [user._id]: user.firstname,
          }));
        });
    }
  }, [loading]);

  if (!loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {chat.map(({ sender, message }, index) => (
          <div
            key={index}
            style={{
              alignSelf: sender === currentUser.uid ? "flex-end" : "flex-start",
            }}
          >
            <p
              style={{
                padding: 10,
                backgroundColor: sender === currentUser.uid ? "blue" : "green",
                borderRadius: 50,
              }}
            >
              {participantDict[sender]}: {message}
            </p>
          </div>
        ))}
      </div>
    );
  }
}
