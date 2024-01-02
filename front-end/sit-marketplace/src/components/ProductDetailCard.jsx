import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import EditProduct from "./EditProduct.jsx";
import { socket } from "./socket.jsx";
import CommentPage from "./CommentPage.jsx";
import Comment from "./Comment.jsx";
import Error from "./Error.jsx";

import {
  Grid,
  CardMedia,
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

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import {
  ADD_FAVORITE_TO_USER,
  REMOVE_FAVORITE_FROM_USER,
  SEARCH_PRODUCTS_BY_ID,
  ADD_POSSIBLE_BUYER,
  REMOVE_POSSIBLE_BUYER,
  GET_USER,
  CONFIRM_PRODUCT,
  REJECT_PRODUCT,
} from "../queries";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

export default function ProductDetailCard() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, data } = useQuery(SEARCH_PRODUCTS_BY_ID, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });

  const [hasFavorited, setHasFavorited] = useState(false);
  const [isPossibleBuyer, setIsPossibleBuyer] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [currentBuyer, setCurrentBuyer] = useState({});

  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useQuery(GET_USER, {
    variables: { id: currentUser?.uid },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (currentUser && data) {
      let isCandidate = data.getProductById.possible_buyers.filter((buyer) => {
        return buyer._id == currentUser.uid;
      });
      console.log(isCandidate);
      if (isCandidate.length > 0) {
        setIsPossibleBuyer(true);
      }
    }
  }, [currentUser, data]);

  useEffect(() => {
    if (data && userData) {
      let fav = userData.getUserById.favorite_products.filter((product) => {
        return product._id == data.getProductById._id;
      });
      if (fav.length > 0) {
        setHasFavorited(true);
      }
    }
  }, [userData, data]);

  const [addPossibleBuyer] = useMutation(ADD_POSSIBLE_BUYER, {
    onCompleted: () => {
      setIsPossibleBuyer(true);
      alert(
        "Congrats! You're a candidate buyer now!\n\nFeel free to contact the seller for further information."
      );
    },
  });
  const [removePossibleBuyer] = useMutation(REMOVE_POSSIBLE_BUYER, {
    onCompleted: () => {
      setIsPossibleBuyer(false);
      alert("You're no longer a buyer candidate...");
    },
  });

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_FROM_USER, {
    onCompleted: () => {
      setHasFavorited(false);
    },
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_TO_USER, {
    onCompleted: () => {
      setHasFavorited(true);
    },
  });

  const [confirmProduct] = useMutation(CONFIRM_PRODUCT, {
    onCompleted: () => {
      alert("Congratulations! You've made a deal!");
    },
  });
  const [rejectProduct] = useMutation(REJECT_PRODUCT, {
    onCompleted: () => {
      alert("You rejected this transaction");
    },
  });

  function handleFavorite() {
    try {
      if (!currentUser) {
        alert("You need to login to favorite this product!");
        return;
      }
      if (hasFavorited) {
        removeFavorite({
          variables: {
            id: currentUser.uid,
            productId: data?.getProductById._id,
          },
        });
      } else {
        addFavorite({
          variables: {
            id: currentUser.uid,
            productId: data?.getProductById._id,
          },
        });
      }
    } catch (error) {
      alert(error);
    }
  }
  if (error) {
    if (error.message == "Invalid id") {
      return <Error statusCodeProp={400} />;
    } else {
      return <Error statusCodeProp={404} />;
    }
  } else if (loading) {
    return <div>Loading</div>;
  }
  if (data) {
    const productData = data.getProductById;
    console.log(productData);
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
          <Grid container direction="row" component="main">
            <Grid item xs>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CardMedia
                  component="img"
                  image={productData.image}
                  title="thumbnail"
                  sx={{
                    maxWidth: "60%",
                    height: "80vh",
                  }}
                />
              </div>
            </Grid>

            <Grid item xs>
              <Grid container direction="column" padding={2} spacing={5}>
                <Grid item xs>
                  <Typography
                    align="left"
                    variant="h4"
                    sx={{ fontWeight: "bolder" }}
                  >
                    {productData.name}
                  </Typography>
                </Grid>

                <Grid item xs>
                  <Typography
                    align="left"
                    variant="h5"
                    sx={{ fontWeight: "bold" }}
                  >
                    {productData.description}
                  </Typography>
                </Grid>

                <Grid item xs>
                  <div>
                    <p>Seller: {productData.seller.firstname}</p>
                    {productData.status === "completed" &&
                    currentUser &&
                    (currentUser.uid === productData.seller._id ||
                      currentUser.uid === productData.buyer._id) ? (
                      <p>Buyer: {productData.buyer.firstname}</p>
                    ) : null}
                    <p>
                      Category:{" "}
                      {productData.category == "book"
                        ? "Book"
                        : productData.category == "other"
                        ? "Other"
                        : productData.category == "electronics"
                        ? "Electronics"
                        : productData.category == "furniture"
                        ? "Furniture"
                        : "Stationary"}
                    </p>
                    <p>
                      Condition:{" "}
                      {productData.condition == "brand new"
                        ? "Brand New"
                        : productData.condition == "like new"
                        ? "Like New"
                        : productData.condition == "gently used"
                        ? "Gently Used"
                        : "Functional"}
                    </p>
                    <p>Price: {productData.price.toFixed(2)}</p>
                    <p>
                      Post Date:{" "}
                      {/^\d+$/.test(productData.date)
                        ? new Date(parseInt(productData.date)).toLocaleString()
                        : new Date(productData.date).toLocaleString()}
                    </p>
                    <p>
                      Status:{" "}
                      {productData.status == "active"
                        ? "Active"
                        : productData.status == "inactive"
                        ? "Inactive"
                        : productData.status == "pending"
                        ? "In Progress"
                        : productData.status == "rejected"
                        ? "Rejected"
                        : "Completed"}
                    </p>
                    {productData.status === "completed" &&
                    currentUser &&
                    (currentUser.uid === productData.seller_id ||
                      currentUser.uid === productData.buyer_id) ? (
                      <p>
                        Completion Date:{" "}
                        {new Date(
                          parseInt(productData.completion_date)
                        ).toLocaleString()}
                      </p>
                    ) : null}
                  </div>

                  <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
                  {!currentUser && <p>Login to unlock more features</p>}
                  {currentUser && (
                    <div>
                      {currentUser.uid == productData.seller._id &&
                        productData.status == "active" && (
                          <>
                            <EditProduct productData={productData} />
                            <p>
                              <Typography
                                component="span"
                                color="primary"
                                style={{
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                  marginRight: 2,
                                }}
                                onClick={() => {
                                  if (productData.possible_buyers.length > 0) {
                                    setToggle(true);
                                  }
                                }}
                              >
                                {productData.possible_buyers.length}
                              </Typography>
                              &nbsp;people want to buy this item
                            </p>
                            <Dialog
                              open={toggle}
                              maxWidth="sm"
                              fullWidth={true}
                            >
                              <DialogTitle>
                                Candidates' Rating Profile
                              </DialogTitle>
                              <DialogContent style={{ overflow: "auto" }}>
                                <Box sx={{ display: "flex" }}>
                                  <div>
                                    {productData.possible_buyers.map(
                                      (user, index) => {
                                        return (
                                          <div key={index}>
                                            <Typography
                                              component="p"
                                              style={{
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                                color:
                                                  user == currentBuyer
                                                    ? "black"
                                                    : "blue",
                                                fontWeight:
                                                  user == currentBuyer
                                                    ? "bold"
                                                    : "normal",
                                              }}
                                              onClick={() => {
                                                setCurrentBuyer(user);
                                              }}
                                            >
                                              {user.firstname}
                                            </Typography>
                                            {index !=
                                              productData.possible_buyers
                                                .length -
                                                1 && <Divider></Divider>}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                  {currentBuyer._id && (
                                    <CommentPage user_id={currentBuyer._id} />
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
                      {currentUser.uid == productData.seller._id &&
                        productData.status == "inactive" && (
                          <EditProduct productData={productData} />
                        )}
                      {currentUser.uid == productData.seller._id &&
                        productData.status == "pending" && (
                          <p>
                            Waiting for confirmation from{" "}
                            {productData.buyer.firstname}
                          </p>
                        )}
                      {currentUser.uid == productData.seller._id &&
                        productData.status == "rejected" && (
                          <>
                            <p>
                              Rejected by {productData.buyer.firstname}. Repost
                              by editting
                            </p>
                            <EditProduct productData={productData} />
                          </>
                        )}
                      {currentUser.uid == productData.seller._id &&
                        productData.status == "completed" && (
                          <Comment data={productData} />
                        )}
                      {currentUser.uid != productData.seller._id &&
                        productData.status == "active" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="inherit"
                              onClick={async () => {
                                socket.emit("join room", {
                                  room: productData.seller._id,
                                  user: currentUser.uid,
                                });
                              }}
                              sx={{ fontWeight: "bold" }}
                            >
                              Chat
                            </Button>
                            {isPossibleBuyer ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                  removePossibleBuyer({
                                    variables: {
                                      id: productData._id,
                                      buyerId: currentUser.uid,
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
                                  addPossibleBuyer({
                                    variables: {
                                      id: productData._id,
                                      buyerId: currentUser.uid,
                                    },
                                  });
                                }}
                                sx={{ fontWeight: "bold", marginLeft: 2 }}
                              >
                                Buy
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
                      {currentUser.uid != productData.seller._id &&
                        productData.status == "inactive" && (
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

                            {isPossibleBuyer && (
                              <Button
                                size="small"
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                  removePossibleBuyer({
                                    variables: {
                                      id: productData._id,
                                      buyerId: currentUser.uid,
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
                      {currentUser.uid != productData.seller._id &&
                        productData.buyer &&
                        currentUser.uid != productData.buyer._id &&
                        (productData.status == "pending" ||
                          productData.status == "rejected") && (
                          <>
                            {isPossibleBuyer ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="inherit"
                                onClick={() => {
                                  removePossibleBuyer({
                                    variables: {
                                      id: productData._id,
                                      buyerId: currentUser.uid,
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
                                  addPossibleBuyer({
                                    variables: {
                                      id: productData._id,
                                      buyerId: currentUser.uid,
                                    },
                                  });
                                }}
                                sx={{ fontWeight: "bold", marginLeft: 2 }}
                              >
                                Buy
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
                      {productData.status == "pending" &&
                        productData.buyer &&
                        currentUser.uid == productData.buyer._id && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="inherit"
                              sx={{ fontWeight: "bold", marginLeft: 2 }}
                              onClick={() => {
                                confirmProduct({
                                  variables: {
                                    _id: productData._id,
                                    buyer_id: currentUser.uid,
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
                                rejectProduct({
                                  variables: {
                                    _id: productData._id,
                                    buyer_id: currentUser.uid,
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
                      {productData.status == "rejected" &&
                        productData.buyer &&
                        currentUser.uid == productData.buyer._id && (
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
                      {productData.status == "completed" &&
                        productData.buyer &&
                        currentUser.uid == productData.buyer._id && (
                          <Comment data={productData} />
                        )}
                      {productData.status == "completed" && (
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
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}
