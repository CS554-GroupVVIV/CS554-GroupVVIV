import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { socketID, socket } from "./socket";

import { Card, CardHeader, CardContent, Grid, Link } from "@mui/material";

export default function PostCard({ postData }) {
  const [id, setId] = useState(undefined);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  return (
    <Grid item>
      <Card
        sx={{ width: 300, height: "100%" }}
        style={{
          backgroundColor: "snow",
          borderRadius: "10%",
        }}
      >
        <Link onClick={() => navigate(`/post/${postData._id}`)}>
          <CardHeader title={postData.item}></CardHeader>
        </Link>
        <CardContent
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ul>
            <li>Category: {postData.category}</li>
            <li>Description: {postData.description}</li>
            <li>Condition: {postData.condition}</li>
            <li>Price: {postData.price}</li>
            <li>Date: {postData.date}</li>
          </ul>
          <button
            hidden={
              !currentUser || postData.buyer_id === currentUser.uid
                ? true
                : false
            }
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
        </CardContent>
      </Card>
    </Grid>
  );
}
