import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { socketID, socket } from "./socket";

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Link,
  Button,
} from "@mui/material";

export default function PostCard({ postData }) {
  const [id, setId] = useState(undefined);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  return (
    <Grid item>
      <Card sx={{ width: 300, height: "100%" }}>
        <Link
          component="button"
          sx={{
            textDecoration: "none",
          }}
          onClick={() => navigate(`/post/${postData._id}`)}
        >
          <CardHeader title={postData.item}></CardHeader>
        </Link>

        <CardContent>
          <p>Price: {postData.price}</p>
          <p>Condition: {postData.condition}</p>

          {currentUser && (
            <>
              {postData.buyer_id !== currentUser.uid ? (
                <Button
                  size="small"
                  variant="contained"
                  color="inherit"
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
                </Button>
              ) : (
                <></>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
