import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import noImage from "../assets/noimage.jpg";
import { AuthContext } from "../context/AuthContext";
import EditProduct from "./EditProduct.jsx";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { socket } from "./socket";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
  Link,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import {
  ADD_FAVORITE_TO_USER,
  REMOVE_FAVORITE_FROM_USER,
  ADD_POSSIBLE_BUYER,
  GET_USER,
  REMOVE_POSSIBLE_BUYER,
} from "../queries";
import { useQuery, useMutation } from "@apollo/client";
import Comment from "./Comment";

export default function ProductCard({ productData }) {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isPossibleBuyer, setIsPossibleBuyer] = useState(false);
  const [hasFavorited, setHasFavorited] = useState(false);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER, {
    variables: { id: currentUser?.uid },
    fetchPolicy: "cache-and-network",
  });

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
    // refetchQueries: [GET_USER, "getUserById"],
    onCompleted: () => {
      setHasFavorited(false);
    },
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_TO_USER, {
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
    if (currentUser && productData && productData.possible_buyers) {
      let isCandidate = productData.possible_buyers.filter((buyer) => {
        return buyer._id == currentUser.uid;
      });
      if (isCandidate && isCandidate.length > 0) {
        setIsPossibleBuyer(true);
      }
    }
  }, [currentUser, productData]);

  useEffect(() => {
    if (currentUser && userData && userData.getUserById) {
      let fav = userData.getUserById.favorite_products.filter((product) => {
        return product._id == productData._id;
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
          variables: { id: currentUser.uid, productId: productData._id },
        });
      } else {
        addFavorite({
          variables: { id: currentUser.uid, productId: productData._id },
        });
      }
    } catch (error) {
      alert(error.message);
    }
  }

  const baseUrl = "/product/";

  if (productData) {
    return (
      <Grid item>
        <Card sx={{ width: 300, height: "100%" }}>
          <Link
            component="button"
            sx={{
              textDecoration: "none",
            }}
            onClick={() => navigate(baseUrl + productData._id)}
          >
            <CardHeader
              titleTypographyProps={{ fontWeight: "bold" }}
              title={productData.name}
            ></CardHeader>
          </Link>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <CardMedia
              component="img"
              image={productData.image ? productData.image : noImage}
              title="thumbnail"
              sx={{
                width: "auto",
                height: 300,
              }}
            />
          </div>

          <CardContent>
            <p>Price: {productData.price.toFixed(2)}</p>
            <p>
              Condition:
              {productData.condition == "brand new"
                ? "Brand New"
                : productData.condition == "like new"
                ? "Like New"
                : productData.condition == "gently used"
                ? "Gently Used"
                : "Functional"}
            </p>

            {currentUser && (
              <div>
                {currentUser.uid == productData.seller._id &&
                  productData.status == "active" && (
                    <EditProduct productData={productData} />
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
                      <p>Rejected by {productData.buyer.firstname}.</p>
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
                {currentUser.uid != productData.seller._id &&
                  productData.status == "inactive" && (
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

                {productData.status == "pending" &&
                  productData.buyer &&
                  currentUser.uid == productData.buyer._id && (
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
