import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { socket } from "./socket";
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
  Typography,
} from "@mui/material";
import EditPost from "./EditPost.jsx";
import {
  ADD_FAVORITE_POST_TO_USER,
  REMOVE_FAVORITE_POST_FROM_USER,
  ADD_POSSIBLE_SELLER,
  REMOVE_POSSIBLE_SELLER,
  GET_USER,
} from "../queries";
import { useQuery, useMutation } from "@apollo/client";

export default function PostCard({ postData }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isPossibleSeller, setIsPossibleSeller] = useState(false);
  const [hasFavorited, setHasFavorited] = useState(false);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER, {
    variables: { id: currentUser?.uid },
    fetchPolicy: "cache-and-network",
  });
  const [addPossibleSeller] = useMutation(ADD_POSSIBLE_SELLER, {
    onCompleted: () => {
      setIsPossibleSeller(true);
      alert(
        "Congrats! You're a candidate seller now!\n\nFeel free to contact the buyer for further information."
      );
    },
    refetchQueries: [
      {
        query: GET_USER,
        variables: { id: currentUser?.uid },
      },
    ],
  });

  const [removePossibleSeller] = useMutation(REMOVE_POSSIBLE_SELLER, {
    onCompleted: () => {
      setIsPossibleSeller(false);
      alert("You're no longer a seller candidate...");
    },
    refetchQueries: [
      {
        query: GET_USER,
        variables: { id: currentUser?.uid },
      },
    ],
  });
  // }

  const baseUrl = "/post/";

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_POST_FROM_USER, {
    // refetchQueries: [GET_USER, "getUserById"],
    onCompleted: () => {
      setHasFavorited(false);
    },
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_POST_TO_USER, {
    // refetchQueries: [
    //   {
    //     query: GET_USER,
    //     variables: { _id: currentUser ? currentUser.uid : "" },
    //   },
    // ],
    onCompleted: () => {
      setHasFavorited(true);
    },
  });

  useEffect(() => {
    if (currentUser && postData && postData.possible_sellers) {
      let isCandidate = postData.possible_sellers.filter((seller) => {
        return seller._id == currentUser.uid;
      });
      if (isCandidate?.length > 0) {
        setIsPossibleSeller(true);
      }
    }
  }, [currentUser, postData]);

  useEffect(() => {
    if (currentUser && userData) {
      let fav = userData.getUserById.favorite_posts.filter((post) => {
        return post._id == postData._id;
      });
      if (fav.length > 0) {
        setHasFavorited(true);
      }
    }
  }, [userData]);

  function handleFavorite() {
    try {
      if (!currentUser) {
        alert("You need to login to favorite this product!");
        return;
      }
      if (hasFavorited) {
        removeFavorite({
          variables: { id: currentUser.uid, postId: postData._id },
        });
      } else {
        addFavorite({
          variables: { id: currentUser.uid, postId: postData._id },
        });
      }
    } catch (error) {
      alert(error.message);
    }
  }

  if (postData) {
    return (
      <Grid item>
        <Card sx={{ width: 300, height: "100%" }}>
          <Link
            component="button"
            sx={{
              textDecoration: "none",
            }}
            onClick={() => navigate(baseUrl + postData._id)}
          >
            <CardHeader
              titleTypographyProps={{ fontWeight: "bold" }}
              title={postData.name}
            ></CardHeader>
          </Link>

          <CardContent>
            <p>Price: {postData.price.toFixed(2)}</p>
            <p>
              Condition:{" "}
              {postData.condition == "brand new"
                ? "Brand New"
                : postData.condition == "like new"
                ? "Like New"
                : postData.condition == "gently used"
                ? "Gently Used"
                : "Functional"}
            </p>

            {currentUser && (
              <div>
                {currentUser.uid == postData.buyer._id &&
                  postData.status == "active" && (
                    <EditPost postData={postData} />
                  )}

                {currentUser.uid == postData.buyer._id &&
                  postData.status == "inactive" && (
                    <EditPost postData={postData} />
                  )}

                {currentUser.uid == postData.buyer._id &&
                  postData.status == "pending" && (
                    <p>
                      Waiting for confirmation from {postData.seller.firstname}
                    </p>
                  )}
                {currentUser.uid == postData.buyer._id &&
                  postData.status == "rejected" && (
                    <>
                      <p>Rejected by {postData.seller.firstname}.</p>
                      {/* <EditPost postData={postData} /> */}
                    </>
                  )}
                {currentUser.uid == postData.buyer._id &&
                  postData.status == "completed" && <Comment data={postData} />}

                {currentUser.uid != postData.buyer._id &&
                  postData.status == "active" && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        onClick={async () => {
                          socket.emit("join room", {
                            room: postData.buyer._id,
                            user: currentUser.uid,
                          });
                        }}
                        sx={{ fontWeight: "bold" }}
                      >
                        Chat
                      </Button>
                      {isPossibleSeller ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            removePossibleSeller({
                              variables: {
                                id: postData._id,
                                sellerId: currentUser.uid,
                              },
                            });
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
                            addPossibleSeller({
                              variables: {
                                id: postData._id,
                                sellerId: currentUser.uid,
                              },
                            });
                          }}
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                        >
                          Sell
                        </Button>
                      )}
                      <IconButton
                        sx={{ float: "right", justifyContent: "center" }}
                        onClick={handleFavorite}
                      >
                        {hasFavorited ? (
                          <FavoriteIcon sx={{ color: "#e91e63" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </>
                  )}
                {currentUser.uid != postData.buyer._id &&
                  postData.status == "inactive" && (
                    <>
                      <IconButton
                        sx={{ float: "right", justifyContent: "center" }}
                        onClick={handleFavorite}
                      >
                        {hasFavorited ? (
                          <FavoriteIcon sx={{ color: "#e91e63" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>

                      {isPossibleSeller && (
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            removePossibleSeller({
                              variables: {
                                id: postData._id,
                                sellerId: currentUser.uid,
                              },
                            });
                          }}
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                        >
                          Cancel
                        </Button>
                      )}
                    </>
                  )}
                {currentUser.uid != postData.buyer._id &&
                  postData.seller &&
                  currentUser.uid != postData.seller._id &&
                  (postData.status == "pending" ||
                    postData.status == "rejected") && (
                    <>
                      {isPossibleSeller ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            removePossibleSeller({
                              variables: {
                                id: postData._id,
                                sellerId: currentUser.uid,
                              },
                            });
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
                            addPossibleSeller({
                              variables: {
                                id: postData._id,
                                sellerId: currentUser.uid,
                              },
                            });
                          }}
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                        >
                          Sell
                        </Button>
                      )}
                      <IconButton
                        sx={{ float: "right", justifyContent: "center" }}
                        onClick={handleFavorite}
                      >
                        {hasFavorited ? (
                          <FavoriteIcon sx={{ color: "#e91e63" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </>
                  )}
                {postData.status == "pending" &&
                  postData.seller &&
                  currentUser.uid == postData.seller._id && (
                    <>
                      {/* <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        sx={{ fontWeight: "bold", marginLeft: 2 }}
                        
                      >
                        Confirm
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        sx={{ fontWeight: "bold", marginLeft: 2 }}
                      >
                        Reject
                      </Button> */}
                      <Typography variant="body1">
                        Await your confirmation
                      </Typography>

                      <IconButton
                        sx={{ float: "right", justifyContent: "center" }}
                        onClick={handleFavorite}
                      >
                        {hasFavorited ? (
                          <FavoriteIcon sx={{ color: "#e91e63" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </>
                  )}

                {postData.status == "rejected" &&
                  postData.seller &&
                  currentUser.uid == postData.seller._id && (
                    <>
                      You have rejetced this transaction
                      <IconButton
                        sx={{ float: "right", justifyContent: "center" }}
                        onClick={handleFavorite}
                      >
                        {hasFavorited ? (
                          <FavoriteIcon sx={{ color: "#e91e63" }} />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </>
                  )}

                {postData.status == "completed" &&
                  postData.seller &&
                  currentUser.uid == postData.seller._id && (
                    <Comment data={postData} />
                  )}
                {postData.status == "completed" && (
                  <IconButton
                    sx={{ float: "right", justifyContent: "center" }}
                    onClick={handleFavorite}
                  >
                    {hasFavorited ? (
                      <FavoriteIcon sx={{ color: "#e91e63" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
