import { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_POSTS,
  SEARCH_POST_BY_ID,
  GET_USER,
  ADD_POSSIBLE_SELLER,
} from "../queries";
import { socketID, socket } from "./socket";
import { AuthContext } from "../context/AuthContext.jsx";
import Comment from "./Comment.jsx";
import { useNavigate, useParams } from "react-router-dom";
import EditPost from "./EditPost.jsx";

import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Link,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";

export default function PostDetail() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_POSTS);

  const { data, loading, error } = useQuery(SEARCH_POST_BY_ID, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });
  const { data: userData, error: userError } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const [addPossibleSeller] = useMutation(ADD_POSSIBLE_SELLER);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    return <h1>Error loading post</h1>;
  } else {
    const post = data.getPostById;
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid
          container
          direction={"column"}
          marginTop={12}
          component="main"
          style={{
            maxWidth: "50vw",
          }}
        >
          <Grid item xs>
            <Typography align="left" variant="h4" sx={{ fontWeight: "bolder" }}>
              {post.item}
            </Typography>
          </Grid>

          <Divider sx={{ marginTop: 3, marginBottom: 3 }} />

          <Grid item xs>
            <div>
              <p>Buyer Id: {post.buyer_id}</p>
              {post.status === "completed" &&
              currentUser &&
              (currentUser.uid === post.seller_id ||
                currentUser.uid === post.buyer_id) ? (
                <p>Seller Id: {post.seller_id}</p>
              ) : null}
              <p>Category: {post.category}</p>
              <p>Price: {post.price}</p>
              <p>Transaction Date: {new Date(post.date).toLocaleString()}</p>
              <p>Status: {post.status}</p>
            </div>

            <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
            {currentUser ? (
              <div>
                <div className="card-actions justify-end">
                  {post.status !== "completed" &&
                  post.buyer_id === currentUser.uid ? (
                    <EditPost postData={post} />
                  ) : (
                    <p>Completed, only poster can edit.</p>
                  )}
                  {post.status === "completed" &&
                  (post.buyer_id === currentUser.uid ||
                    post.seller_id === currentUser.uid) ? (
                    <Comment data={post} />
                  ) : (
                    <p>Completed, only poster/seller can comment.</p>
                  )}
                  {post.buyer_id !== currentUser.uid ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="inherit"
                      onClick={() => {
                        if (currentUser.uid) {
                          addPossibleSeller({
                            variables: {
                              id: data.getPostById._id,
                              buyerId: userData.getUserById._id,
                            },
                          });
                          socket.emit("join room", {
                            room: post.seller_id,
                            user: currentUser.uid,
                          });
                        }
                      }}
                    >
                      Chat with buyer
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <p>(Login to chat with seller or add product to favorite)</p>
            )}

            <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
            <Button
              size="small"
              variant="contained"
              color="inherit"
              onClick={() => {
                navigate(-1);
              }}
              sx={{ fontWeight: "bold" }}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
