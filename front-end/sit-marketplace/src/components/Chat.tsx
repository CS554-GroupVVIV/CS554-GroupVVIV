import React, { useEffect, useRef, useState, useContext } from "react";

import { useQuery } from "@apollo/client";
import { GET_USERS_BY_IDS } from "../queries";

export default function Chat({ chat, participants }) {
  const [participantDict, setParticipantDict] = useState({});

  const { loading, error, data } = useQuery(GET_USERS_BY_IDS, {
    variables: { ids: participants },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!loading) {
      if (error) console.log(error);
      else {
        const users = data.getUsersByIds;
        users &&
          users.map((user) => {
            console.log(user._id, user.firstname);
            setParticipantDict((prev) => ({
              ...prev,
              [user._id]: user.firstname,
            }));
          });
      }
    }
  }, [loading]);

  if (!loading) {
    return chat.map(({ sender, message }, index) => (
      <div key={index}>
        <h3>
          {participantDict[sender]}: <span>{message}</span>
        </h3>
      </div>
    ));
  }
}
