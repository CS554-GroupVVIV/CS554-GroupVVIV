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

  const { data: buyerData } = useQuery(GET_USER, {
    variables: { id: data ? data.getPostById.buyer_id : "" },
    fetchPolicy: "cache-and-network",
  });

  const { data: sellerData } = useQuery(GET_USER, {
    variables: {
      id: data && data.getPostById.seller_id ? data.getPostById.seller_id : "",
    },
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
        alert("You need to login to favorite this post!");
        return;
      }
      if (data) {
        if (hasFavorited) {
          removeFavorite({
            variables: { id: currentUser.uid, postId: data.getPostById._id },
          });
          setHasFavorited(false);
        } else {
          addFavorite({
            variables: { id: currentUser.uid, postId: data.getPostById._id },
          });
          setHasFavorited(true);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    if (!userLoading) {
      // console.log(userData?.getUserById.favorite_post);
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
  } else if (data && buyerData) {
    const post = data.getPostById;
    return (
      <>
        <Grid container marginTop={12} marginLeft={5} component="main">
          <Button
            size="small"
            variant="contained"
            // color="inherit"
            onClick={() => {
              navigate(-1);
            }}
            sx={{ fontWeight: "bold" }}
          >
            Back
          </Button>
        </Grid>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            direction={"column"}
            component="main"
            style={{
              maxWidth: "50vw",
            }}
          >
            <Grid item xs>
              <Typography
                align="left"
                variant="h4"
                sx={{ fontWeight: "bolder" }}
              >
                {post.item}
              </Typography>
            </Grid>

            <Grid item xs>
              <Typography
                align="left"
                variant="h5"
                sx={{ mt: 5, fontWeight: "bolder" }}
              >
                {post.description}
              </Typography>
            </Grid>

            <Divider sx={{ marginTop: 3, marginBottom: 3 }} />

            <Grid item xs>
              <div>
                <p>Buyer: {buyerData.getUserById.firstname}</p>
                {post.status === "completed" &&
                currentUser &&
                (currentUser.uid === post.seller_id ||
                  currentUser.uid === post.buyer_id) &&
                sellerData ? (
                  <p>Seller: {sellerData.getUserById.firstname}</p>
                ) : null}
                <p>Category: {post.category}</p>
                <p>Condition: {post.condition}</p>
                <p>Price: {post.price.toFixed(2)}</p>
                <p>Post Date: {new Date(post.date).toLocaleString()}</p>
                <p>Status: {post.status}</p>
                {post.status === "completed" &&
                currentUser &&
                (currentUser.uid === post.seller_id ||
                  currentUser.uid === post.buyer_id) ? (
                  <p>
                    Completion Date:{" "}
                    {new Date(post.completion_date).toLocaleString()}
                  </p>
                ) : (
                  <></>
                )}
              </div>

              <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
              {currentUser ? (
                <div>
                  <div className="card-actions justify-end">
                    {post.status !== "completed" &&
                    post.buyer_id === currentUser.uid ? (
                      <EditPost postData={post} />
                    ) : null}
                    {post.status === "completed" &&
                    (post.buyer_id === currentUser.uid ||
                      post.seller_id === currentUser.uid) ? (
                      <Comment data={post} />
                    ) : null}

                    {post.status === "active" &&
                    post.buyer_id !== currentUser.uid ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          // color="inherit"
                          onClick={async () => {
                            if (currentUser.uid) {
                              socket.emit("join room", {
                                room: post.buyer_id,
                                user: currentUser.uid,
                              });
                            }
                          }}
                          sx={{ fontWeight: "bold" }}
                        >
                          Chat
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={async () => {
                            if (currentUser.uid) {
                              await addPossibleSeller({
                                variables: {
                                  id: post._id,
                                  sellerId: currentUser.uid,
                                },
                              });

                              addFavorite({
                                variables: {
                                  id: currentUser.uid,
                                },
                              });
                              setHasFavorited(true);

                              alert(
                                "You're a potential seller now!\n\nFeel free to contact the buyer for further information."
                              );
                            }
                          }}
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                        >
                          Sell
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
                      <p>(You're the Poster)</p>
                    )}
                  </div>
                </div>
              ) : (
                <p>(Login to chat with buyer or add post to favorite)</p>
              )}
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}
