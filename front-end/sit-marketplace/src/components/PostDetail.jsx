import { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  SEARCH_POST_BY_ID,
  GET_USER,
  ADD_POSSIBLE_SELLER,
  ADD_FAVORITE_POST_TO_USER,
  REMOVE_FAVORITE_POST_FROM_USER,
  REMOVE_POSSIBLE_SELLER,
  CONFIRM_POST,
  REJECT_POST,
} from "../queries";
import { socket } from "./socket";
import { AuthContext } from "../context/AuthContext.jsx";
import Comment from "./Comment.jsx";
import { useNavigate, useParams } from "react-router-dom";
import EditPost from "./EditPost.jsx";
import CommentPage from "./CommentPage.jsx";
import Error from "./Error.jsx";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function PostDetail() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  let { id } = useParams();

  const { data, loading, error } = useQuery(SEARCH_POST_BY_ID, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });

  const [isPossibleSeller, setIsPossibleSeller] = useState(false);
  const [hasFavorited, setHasFavorited] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [currentSeller, setCurrentSeller] = useState({});

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useQuery(GET_USER, {
    variables: { id: currentUser.uid },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data && userData) {
      const favorite_posts = userData.getUserById.favorite_posts;
      for (let i = 0; i < favorite_posts.length; i++) {
        if (favorite_posts[i]._id === data.getPostById._id) {
          setHasFavorited(true);
          break;
        }
      }

      const possible_sellers = userData.getUserById.possible_seller;
      for (let i = 0; i < possible_sellers.length; i++) {
        if (possible_sellers[i]._id === data.getPostById._id) {
          setIsPossibleSeller(true);
          break;
        }
      }
    }
  }, [data, userData]);

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

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_POST_FROM_USER, {
    onCompleted: () => {
      setHasFavorited(false);
    },
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_POST_TO_USER, {
    onCompleted: () => {
      setHasFavorited(true);
    },
  });

  const [confirmPost] = useMutation(CONFIRM_POST, {
    onCompleted: () => {
      alert("Congratulations! You've made a deal!");
    },
    refetchQueries: [
      {
        query: SEARCH_POST_BY_ID,
        variables: { id: id },
      },
    ],
  });
  const [rejectPost] = useMutation(REJECT_POST, {
    onCompleted: () => {
      alert("You rejected this transaction");
    },
    refetchQueries: [
      {
        query: SEARCH_POST_BY_ID,
        variables: { id: id },
      },
    ],
  });

  function handleFavorite() {
    try {
      if (!currentUser) {
        alert("You need to login to favorite this post!");
        return;
      }
      if (data && hasFavorited) {
        removeFavorite({
          variables: { id: currentUser.uid, postId: data.getPostById._id },
        });
      } else {
        addFavorite({
          variables: { id: currentUser.uid, postId: data.getPostById._id },
        });
      }
    } catch (error) {
      alert(error.message);
    }
  }

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    if (error.message == "Invalid id") {
      return <Error statusCodeProp={400} />;
    } else {
      return <Error statusCodeProp={404} />;
    }
  } else if (data) {
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
                {post.name}
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
                <p>Buyer: {post.buyer.firstname}</p>
                {post.status === "completed" &&
                currentUser &&
                (currentUser.uid === post.seller._id ||
                  currentUser.uid === post.buyer._id) ? (
                  <p>Seller: {post.seller.firstname}</p>
                ) : null}
                <p>
                  Category:{" "}
                  {post.category == "book"
                    ? "Book"
                    : post.category == "other"
                    ? "Other"
                    : post.category == "electronics"
                    ? "Electronics"
                    : post.category == "furniture"
                    ? "Furniture"
                    : "Stationary"}
                </p>
                <p>
                  Condition:{" "}
                  {post.condition == "brand new"
                    ? "Brand New"
                    : post.condition == "like new"
                    ? "Like New"
                    : post.condition == "gently used"
                    ? "Gently Used"
                    : "Functional"}
                </p>
                <p>Price: {post.price.toFixed(2)}</p>
                <p>
                  Post Date:{" "}
                  {/^\d+$/.test(post.date)
                    ? new Date(parseInt(post.date)).toLocaleString()
                    : new Date(post.date).toLocaleString()}
                </p>
                <p>
                  Status:{" "}
                  {post.status == "active"
                    ? "Active"
                    : post.status == "inactive"
                    ? "Inactive"
                    : post.status == "pending"
                    ? "In Progress"
                    : post.status == "rejected"
                    ? "Rejected"
                    : "Completed"}
                </p>

                {currentUser &&
                post.status === "completed" &&
                (currentUser.uid === post.seller._id ||
                  currentUser.uid === post.buyer._id) ? (
                  <p>
                    Completion Date:{" "}
                    {new Date(parseInt(post.completion_date)).toLocaleString()}
                  </p>
                ) : null}
              </div>

              <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
              {!currentUser && <p>Login to unlock more features</p>}
              {currentUser && (
                <div>
                  {currentUser.uid == post.buyer._id &&
                    post.status == "active" && (
                      <>
                        <EditPost postData={post} />
                        <p>
                          <Typography
                            component="span"
                            color="primary"
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (post.possible_sellers.length > 0) {
                                setToggle(true);
                              }
                            }}
                          >
                            {post.possible_sellers.length}
                          </Typography>
                          &nbsp;people want to sell this item
                        </p>
                        <Dialog open={toggle} maxWidth="sm" fullWidth={true}>
                          <DialogTitle>Candidates' Rating Profile</DialogTitle>
                          <DialogContent style={{ overflow: "auto" }}>
                            <Box sx={{ display: "flex" }}>
                              <div>
                                {post.possible_sellers.map((user, index) => {
                                  return (
                                    <div key={index}>
                                      <Typography
                                        component="p"
                                        style={{
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                          color:
                                            user == currentSeller
                                              ? "black"
                                              : "blue",
                                          fontWeight:
                                            user == currentSeller
                                              ? "bold"
                                              : "normal",
                                        }}
                                        onClick={() => {
                                          setCurrentSeller(user);
                                          // console.log(
                                          //   user,
                                          //   user == currentSeller
                                          // );
                                        }}
                                      >
                                        {user.firstname}
                                      </Typography>
                                      {index !=
                                        post.possible_sellers.length - 1 && (
                                        <Divider></Divider>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              {currentSeller._id && (
                                <CommentPage user_id={currentSeller._id} />
                              )}
                            </Box>
                          </DialogContent>

                          <DialogActions>
                            <Button
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => setToggle(false)}
                            >
                              Cancel
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </>
                    )}
                  {currentUser.uid == post.buyer._id &&
                    post.status == "inactive" && <EditPost postData={post} />}
                  {currentUser.uid == post.buyer._id &&
                    post.status == "pending" && (
                      <p>
                        Waiting for confirmation from {post.seller.firstname}
                      </p>
                    )}

                  {currentUser.uid == post.buyer._id &&
                    post.status == "rejected" && (
                      <>
                        <p>
                          Rejected by {post.seller.firstname}. Repost by
                          editting
                        </p>
                        <EditPost postData={post} />
                      </>
                    )}
                  {currentUser.uid == post.buyer._id &&
                    post.status == "completed" && <Comment data={post} />}

                  {currentUser.uid != post.buyer._id &&
                    post.status == "active" && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={async () => {
                            socket.emit("join room", {
                              room: post.buyer._id,
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
                                  id: post._id,
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
                                  id: post._id,
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
                          sx={{ justifyContent: "center" }}
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
                  {currentUser.uid != post.buyer._id &&
                    post.status == "inactive" && (
                      <>
                        <IconButton
                          sx={{ justifyContent: "center" }}
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
                                  id: post._id,
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
                  {currentUser.uid != post.buyer._id &&
                    post.seller &&
                    currentUser.uid != post.seller._id &&
                    (post.status == "pending" || post.status == "rejected") && (
                      <>
                        {isPossibleSeller ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="inherit"
                            onClick={() => {
                              removePossibleSeller({
                                variables: {
                                  id: post._id,
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
                                  id: post._id,
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
                          sx={{ justifyContent: "center" }}
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
                  {post.status == "pending" &&
                    post.seller &&
                    currentUser.uid == post.seller._id && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                          onClick={() => {
                            confirmPost({
                              variables: {
                                _id: post._id,
                                seller_id: currentUser.uid,
                              },
                            });
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                          onClick={() => {
                            rejectPost({
                              variables: {
                                _id: post._id,
                                seller_id: currentUser.uid,
                              },
                            });
                          }}
                        >
                          Reject
                        </Button>
                        <IconButton
                          sx={{ justifyContent: "center" }}
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
                  {post.status == "rejected" &&
                    post.seller &&
                    currentUser.uid == post.seller._id && (
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
                  {post.status == "completed" &&
                    post.seller &&
                    currentUser.uid == post.seller._id && (
                      <Comment data={post} />
                    )}
                  {post.status == "completed" && (
                    <IconButton
                      sx={{ justifyContent: "center" }}
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
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}
