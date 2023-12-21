import { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_POSTS,
  SEARCH_POST_BY_ID,
  GET_USER,
  ADD_POSSIBLE_SELLER,
  GET_USER_FOR_FAVORITE,
  ADD_FAVORITE_POST_TO_USER,
  REMOVE_FAVORITE_POST_FROM_USER,
} from "../queries";
import { socket } from "./socket";
import { AuthContext } from "../context/AuthContext.jsx";
import Comment from "./Comment.jsx";
import { useNavigate, useParams } from "react-router-dom";
import EditPost from "./EditPost.jsx";
import Error from "./Error.jsx";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Grid, Typography, Button, IconButton, Divider } from "@mui/material";

export default function PostDetail() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  let { id } = useParams();
  const [hasFavorited, setHasFavorited] = useState(false);

  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_POSTS);

  const { data, loading, error } = useQuery(SEARCH_POST_BY_ID, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useQuery(GET_USER_FOR_FAVORITE, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const [addPossibleSeller] = useMutation(ADD_POSSIBLE_SELLER);

  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(REMOVE_FAVORITE_POST_FROM_USER, {
      refetchQueries: [GET_USER, "getUserById"],
    });

  const [addFavorite, { addData, addLoading, addError }] = useMutation(
    ADD_FAVORITE_POST_TO_USER,
    {
      refetchQueries: [
        {
          query: GET_USER,
          variables: { _id: currentUser ? currentUser.uid : "" },
        },
      ],
    }
  );

  function handleFavorite() {
    try {
      if (!currentUser || !currentUser.uid) {
        alert("You need to login to favorite this product!");
        return;
      }
      if (data) {
        // console.log(data, "data");
        if (hasFavorited) {
          removeFavorite({
            variables: { id: currentUser.uid, postId: data.getPostById._id },
          });
          console.log(false);
          setHasFavorited(false);
        } else {
          addFavorite({
            variables: { id: currentUser.uid, postId: data.getPostById._id },
          });
          setHasFavorited(true);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    console.log(userData?.getUserById?.favorite_post);
    if (!userLoading) {
      console.log(userData?.getUserById.favorite_post);

      if (
        userData?.getUserById?.favorite_post?.includes(data?.getPostById._id)
      ) {
        setHasFavorited(true);
      } else {
        setHasFavorited(false);
      }
    }
  }, [userLoading, userData, userError]);

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    if (error.message == "Invalid id") {
      return <Error statusCodeProp={400} />;
    } else {
      return <Error statusCodeProp={404} />;
    }
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
                    <>
                      {" "}
                      <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          if (currentUser.uid) {
                            addPossibleSeller({
                              variables: {
                                id: data.getPostById._id,
                                buyerId: currentUser.uid,
                              },
                            });
                            socket.emit("join room", {
                              room: post.buyer_id,
                              user: currentUser.uid,
                            });
                          }
                        }}
                      >
                        Chat with buyer
                      </Button>
                      <IconButton
                        sx={{ marginLeft: 3 }}
                        onClick={handleFavorite}
                      >
                        {hasFavorited ? (
                          <FavoriteIcon sx={{ color: "#e91e63" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </>
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
