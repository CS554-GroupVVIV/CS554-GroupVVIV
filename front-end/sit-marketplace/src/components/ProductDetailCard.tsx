import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../assets/noimage.jpg";
import { AuthContext } from "../context/AuthContext";
import EditProduct from "./EditProduct.tsx";
import { socketID, socket } from "./socket";
import Comment from "./Comment.tsx";

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

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import {
  ADD_FAVORITE_TO_USER,
  REMOVE_FAVORITE_FROM_USER,
  SEARCH_PRODUCTS_BY_ID,
  GET_USER,
  ADD_POSSIBLE_BUYER,
  GET_USER_FOR_FAVORITE,
} from "../queries";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

export default function ProductDetailCard() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const [hasFavorited, setHasFavorited] = useState(false);
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS_BY_ID, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });
  const { data: userData, error: userError } = useQuery(GET_USER_FOR_FAVORITE, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const baseUrl = "/product/";

  const [addPossibleBuyer] = useMutation(ADD_POSSIBLE_BUYER);

  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(
      REMOVE_FAVORITE_FROM_USER
      // ,{refetchQueries: [GET_USER, "getUserById"]}
    );

  const [addFavorite, { addData, addLoading, addError }] =
    useMutation(ADD_FAVORITE_TO_USER);

  useEffect(() => {
    if (data && userData && userData.getUserById) {
      if (userData.getUserById.favorite?.includes(data.getProductById._id)) {
        console.log(userData.getUserById.favorite);
        setHasFavorited(true);
      }
    }
  }, [userData, data]);

  function handleFavorite(productData) {
    try {
      if (!currentUser || !currentUser.uid) {
        alert("You need to login to favorite this product!");
        return;
      }
      if (hasFavorited) {
        //if already favorited this product, remove this product from favorite list.
        removeFavorite({
          variables: { id: currentUser.uid, productId: productData._id },
        });
        setHasFavorited(false);
      } else {
        addFavorite({
          variables: { id: currentUser.uid, productId: productData._id },
        });
        setHasFavorited(true);
      }
    } catch (error) {
      console.log(error);
    }
    // if (addError || removeError) {
    //   console.log(addError);
    //   console.log(removeError);
    // }
  }
  if (error) {
    return <div>{error.message}</div>;
  } else if (loading) {
    return <div>{loading}</div>;
  }
  if (data) {
    const productData = data.getProductById;
    console.log(data, "data");
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Grid container direction="row" marginTop={12} component="main">
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
                  <p>Seller Id: {productData.seller_id}</p>
                  {productData.status === "completed" &&
                  currentUser &&
                  (currentUser.uid === productData.seller_id ||
                    currentUser.uid === productData.buyer_id) ? (
                    <p>Buyer Id: {productData.buyer_id}</p>
                  ) : (
                    <></>
                  )}
                  <p>Category: {productData.category}</p>
                  <p>Price: {productData.price}</p>
                  <p>
                    Transaction Date:
                    {new Date(productData.date).toLocaleString()}
                  </p>
                  <p>Status: {productData.status}</p>
                </div>

                <Divider sx={{ marginTop: 3, marginBottom: 3 }} />

                <div>
                  {currentUser ? (
                    <div className="card-actions justify-end">
                      {productData.status !== "completed" &&
                      productData.seller_id === currentUser.uid ? (
                        <EditProduct productData={productData} />
                      ) : (
                        <p>Completed, only poster can edit.</p>
                      )}
                      {productData.status === "completed" &&
                      (productData.buyer_id === currentUser.uid ||
                        productData.seller_id === currentUser.uid) ? (
                        <Comment data={productData} />
                      ) : (
                        <p>Completed, only poster/buyer can comment.</p>
                      )}

                      {productData.status === "active" &&
                      productData.seller_id !== currentUser.uid ? (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="inherit"
                            onClick={() => {
                              if (currentUser.uid) {
                                addPossibleBuyer({
                                  variables: {
                                    id: productData.seller_id,
                                    buyerId: currentUser.uid,
                                  },
                                });
                                socket.emit("join room", {
                                  room: productData.seller_id,
                                  user: currentUser.uid,
                                });
                              }
                            }}
                            sx={{ fontWeight: "bold" }}
                          >
                            Chat with seller
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
                  ) : (
                    <p>
                      (Login to chat with seller or add product to favorite)
                    </p>
                  )}
                </div>

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
          </Grid>
        </Grid>
      </div>
    );
  }
}
