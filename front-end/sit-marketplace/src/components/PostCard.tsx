import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { socketID, socket } from "./socket";

import { Card, CardHeader, CardContent, Grid } from "@mui/material";

export default function PostCard({ postData }) {
  const [id, setId] = useState(undefined);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  return (
    <Grid item>
      <Card
        sx={{ width: 300, height: "100%" }}
        style={{
          borderRadius: "10%",
        }}
      >
        <CardHeader title={postData.item}></CardHeader>
        <CardContent
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ul>
            <li>Price: {postData.price}</li>
            <li>Date: {postData.date}</li>
            <li>Description: {postData.description}</li>
            <li>Condition: {postData.condition}</li>
            <li>Category: {postData.category}</li>

            <li>
              <button
                onClick={() => {
                  navigate(`/post/${postData._id}`);
                }}
              >
                Detail
              </button>
            </li>
            <li>
              <button
                hidden={currentUser ? false : true}
                onClick={() => {
                  if (currentUser.uid) {
                    socket.emit("join room", {
                      room: postData.buyer_id,
                      user: currentUser.uid,
                    });

                    // socket.emit("message", {
                    //   room: productData.seller_id,
                    //   sender: currentUser.uid,
                    //   message: `Hi, I have questions regarding product: "${productData.name}"`,
                    //   time: new Date().toISOString(),
                    // });
                  }
                }}
              >
                Chat with buyer
              </button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </Grid>
  );
}
