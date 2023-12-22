import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import noImage from "../assets/noimage.jpg";
import { AuthContext } from "../context/AuthContext";
import Comment from "./Comment.jsx";
import EditProduct from "./EditProduct.jsx";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { socketID, socket } from "./socket";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
  Link,
  Button,
  IconButton,
} from "@mui/material";

import {
  ADD_FAVORITE_TO_USER,
  REMOVE_FAVORITE_FROM_USER,
  ADD_POSSIBLE_BUYER,
  GET_USER_FOR_FAVORITE,
  GET_USER,
  REMOVE_POSSIBLE_BUYER,
  GET_PRODUCTS,
} from "../queries";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import Comment from "./Comment";

export default function ProductCard({ productData }) {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const [isPossibleBuyer, setIsPossibleBuyer] = useState(
    productData &&
      productData.possible_buyers
        .map((buyer) => {
          return buyer._id;
        })
        .includes(currentUser && currentUser.uid)
  );
  useEffect(() => {
    if (productData) {
      setIsPossibleBuyer(
        productData &&
          productData.possible_buyers
            .map((buyer) => {
              return buyer._id;
            })
            .includes(currentUser && currentUser.uid)
      );
    }
  }, [productData]);
  // console.log(productData)

  // console.log("here", isPossibleBuyer);

  const [hasFavorited, setHasFavorited] = useState(false);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_FOR_FAVORITE, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const baseUrl = "/product/";

  const [addPossibleBuyer] = useMutation(ADD_POSSIBLE_BUYER);
  const [removePossibleBuyer] = useMutation(REMOVE_POSSIBLE_BUYER);

  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(REMOVE_FAVORITE_FROM_USER, {
      refetchQueries: [GET_USER, "getUserById"],
    });

  const [addFavorite, { addData, addLoading, addError }] = useMutation(
    ADD_FAVORITE_TO_USER,
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
    if (!userLoading) {
      if (userData?.getUserById?.favorite?.includes(productData._id)) {
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
        //if already favorited this product, remove this product from favorite list.
        removeFavorite({
          variables: { id: currentUser.uid, productId: productData._id },
        });
        console.log(false);
        setHasFavorited(false);
      } else {
        addFavorite({
          variables: { id: currentUser.uid, productId: productData._id },
        });
        setHasFavorited(true);
      }
    } catch (error) {
      console.log(error.message);
    }
    // if (addError || removeError) {
    //   console.log(addError);
    //   console.log(removeError);
    // }
  }

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
            title={productData && productData.name}
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
          <p>Price: {productData && productData.price.toFixed(2)}</p>
          <p>Condition: {productData && productData.condition}</p>

          {currentUser && (
            <div>
              {productData.status !== "completed" &&
              productData.seller_id === currentUser.uid ? (
                <EditProduct productData={productData} />
              ) : null}
              {productData.status === "completed" &&
              (productData.buyer_id === currentUser.uid ||
                productData.seller_id === currentUser.uid) ? (
                <Comment data={productData} />
              ) : null}
              {productData.status == "active" &&
              productData.seller_id !== currentUser.uid ? (
                <div>
                  {productData.status === "completed" ? (
                    <Comment data={productData} />
                  ) : (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        onClick={async () => {
                          if (currentUser.uid) {
                            socket.emit("join room", {
                              room: productData.seller_id,
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
                            if (currentUser.uid) {
                              removePossibleBuyer({
                                variables: {
                                  id: productData._id,
                                  buyerId: currentUser.uid,
                                },
                              });
                              // setIsPossibleBuyer(false);

                              alert("You're no longer a potential buyer ...");
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
                              addPossibleBuyer({
                                variables: {
                                  id: productData._id,
                                  buyerId: currentUser.uid,
                                },
                              });
                              // setIsPossibleBuyer(true);

                              if (!hasFavorited) {
                                addFavorite({
                                  variables: {
                                    id: currentUser.uid,
                                    productId: productData._id,
                                  },
                                });
                                setHasFavorited(true);
                              }

                              alert(
                                "Congrats! You're a potential buyer now!\n\nFeel free to contact the seller for further information."
                              );
                            }
                          }}
                          sx={{ fontWeight: "bold", marginLeft: 2 }}
                        >
                          Buy
                        </Button>
                      )}
                    </>
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
                </div>
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
