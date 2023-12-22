import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { socketID, socket } from "./socket";
import Comment from "./Comment.jsx";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Link,
  Button,
  IconButton,
} from "@mui/material";
import EditPost from "./EditPost.jsx";
import {
  ADD_FAVORITE_POST_TO_USER,
  REMOVE_FAVORITE_POST_FROM_USER,
  GET_USER_FOR_FAVORITE,
  ADD_POSSIBLE_SELLER,
  REMOVE_POSSIBLE_SELLER,
} from "../queries";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries";

export default function PostCard({ postData }) {
  const [id, setId] = useState(undefined);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [isPossibleSeller, setIsPossibleSeller] = useState(false);
  useEffect(() => {
    if (postData) {
      setIsPossibleSeller(
        postData &&
          postData.possible_sellers
            .map((seller) => {
              return seller._id;
            })
            .includes(currentUser && currentUser.uid)
      );
    }
  }, [postData]);

  const [hasFavorited, setHasFavorited] = useState(false);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_FOR_FAVORITE, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });
  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(REMOVE_FAVORITE_POST_FROM_USER, {
      refetchQueries: [GET_USER, "getUserById"],
    });

  const [addPossibleSeller] = useMutation(ADD_POSSIBLE_SELLER);
  const [removePossibleSeller] = useMutation(REMOVE_POSSIBLE_SELLER);

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

  useEffect(() => {
    // console.log(userData?.getUserById?.favorite_post);
    // console.log(postData);
    if (!userLoading) {
      // console.log(userData?.getUserById.favorite_post);

      if (userData?.getUserById?.favorite_post?.includes(postData._id)) {
        setHasFavorited(true);
      } else {
        setHasFavorited(false);
      }
    }
  }, [userLoading, userData, userError]);

  function handleFavorite() {
    try {
      if (!currentUser || !currentUser.uid) {
        alert("You need to login to favorite this product!");
        return;
      }
      if (hasFavorited) {
        removeFavorite({
          variables: { id: currentUser.uid, postId: postData._id },
        });
        console.log(false);
        setHasFavorited(false);
      } else {
        addFavorite({
          variables: { id: currentUser.uid, postId: postData._id },
        });
        setHasFavorited(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <Grid item>
      <Card sx={{ width: 300, height: "100%" }}>
        <Link
          component="button"
          sx={{
            textDecoration: "none",
          }}
          onClick={() => navigate(`/post/${postData && postData._id}`)}
        >
          <CardHeader
            titleTypographyProps={{ fontWeight: "bold" }}
            title={postData && postData.item}
          ></CardHeader>
        </Link>

        <CardContent>
          <p>Price: {postData && postData.price.toFixed(2)}</p>
          <p>Condition: {postData && postData.condition}</p>

          {postData && currentUser && (
            <div>
              {postData.status !== "completed" &&
              postData.buyer_id === currentUser.uid ? (
                <EditPost postData={postData} />
              ) : null}

              {postData.status === "completed" &&
              (postData.buyer_id === currentUser.uid ||
                postData.seller_id === currentUser.uid) ? (
                <Comment data={postData} />
              ) : null}

              {postData.status === "completed" &&
              postData.seller_id === currentUser.uid ? (
                <IconButton sx={{ float: "right" }} onClick={handleFavorite}>
                  {hasFavorited ? (
                    <FavoriteIcon sx={{ color: "#e91e63" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              ) : null}

              {postData.status == "active" &&
              postData.buyer_id !== currentUser.uid ? (
                <>
                  {postData.status === "completed" ? (
                    <Comment data={postData} />
                  ) : (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        onClick={async () => {
                          if (currentUser.uid) {
                            socket.emit("join room", {
                              room: postData.buyer_id,
                              user: currentUser.uid,
                            });
                          }
                        }}
                      >
                        Chat
                      </Button>

                      {isPossibleSeller ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            if (currentUser.uid) {
                              removePossibleSeller({
                                variables: {
                                  id: postData._id,
                                  sellerId: currentUser.uid,
                                },
                              });
                              // setIsPossibleBuyer(false);

                              alert("You're no longer a potential Seller ...");
                            }
                          }}
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            if (currentUser.uid) {
                              addPossibleSeller({
                                variables: {
                                  id: postData._id,
                                  sellerId: currentUser.uid,
                                },
                              });

                              if (!hasFavorited) {
                                addFavorite({
                                  variables: {
                                    postId: postData._id,
                                    id: currentUser.uid,
                                  },
                                });
                                setHasFavorited(true);
                              }

                              alert(
                                "You're a potential seller now!\n\nFeel free to contact the buyer for further information."
                              );
                            }
                          }}
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                        >
                          Sell
                        </Button>
                      )}
                    </>
                  )}

                  <IconButton sx={{ float: "right" }} onClick={handleFavorite}>
                    {hasFavorited ? (
                      <FavoriteIcon sx={{ color: "#e91e63" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </>
              ) : (
                <>{/* <p>(You're the Poster)</p> */}</>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
