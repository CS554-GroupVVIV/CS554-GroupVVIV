import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import EditProduct from "./EditProduct.jsx";
import { socket } from "./socket.jsx";
import Comment from "./Comment.jsx";
import Error from "./Error.jsx";

import {
  Grid,
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
  ADD_POSSIBLE_BUYER,
  REMOVE_POSSIBLE_BUYER,
  GET_USER_FOR_FAVORITE,
  GET_USER,
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

  const [isPossibleBuyer, setIsPossibleBuyer] = useState(false);
  useEffect(() => {
    if (data) {
      console.log(data);
      setIsPossibleBuyer(
        data &&
          data.getProductById.possible_buyers
            .map((buyer) => {
              // console.log(buyer);
              return buyer._id;
            })
            .includes(currentUser && currentUser.uid)
      );
    }
  }, [data]);

  const { data: userData, error: userError } = useQuery(GET_USER_FOR_FAVORITE, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const { data: sellerData } = useQuery(GET_USER, {
    variables: { id: data ? data.getProductById.seller_id : "" },
    fetchPolicy: "cache-and-network",
  });

  const { data: buyerData } = useQuery(GET_USER, {
    variables: {
      id:
        data && data.getProductById.buyer_id
          ? data.getProductById.buyer_id
          : "",
    },
    fetchPolicy: "cache-and-network",
  });

  const [addPossibleBuyer] = useMutation(ADD_POSSIBLE_BUYER);
  const [removePossibleBuyer] = useMutation(REMOVE_POSSIBLE_BUYER);

  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(REMOVE_FAVORITE_FROM_USER, {
      refetchQueries: [GET_USER, "getUserById"],
    });

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
          variables: {
            id: currentUser.uid,
            productId: data?.getProductById._id,
          },
        });
        setHasFavorited(false);
      } else {
        addFavorite({
          variables: {
            id: currentUser.uid,
            productId: data?.getProductById._id,
          },
        });
        setHasFavorited(true);
      }
    } catch (error) {
      alert(error);
    }
    // if (addError || removeError) {
    //   console.log(addError);
    //   console.log(removeError);
    // }
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
  if (data && sellerData) {
    const productData = data.getProductById;

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
                    {/* <p>Seller Id: {productData.seller_id}</p> */}
                    <p>Seller: {sellerData.getUserById.firstname}</p>
                    {productData.status === "completed" &&
                    currentUser &&
                    (currentUser.uid === productData.seller_id ||
                      currentUser.uid === productData.buyer_id) &&
                    buyerData ? (
                      <p>Buyer: {buyerData.getUserById.firstname}</p>
                    ) : (
                      <></>
                    )}
                    <p>Category: {productData.category}</p>
                    <p>Condition: {productData.condition}</p>
                    <p>Price: {productData.price.toFixed(2)}</p>
                    <p>
                      Post Date: {new Date(productData.date).toLocaleString()}
                    </p>
                    <p>Status: {productData.status}</p>
                    {productData.status === "completed" &&
                    currentUser &&
                    (currentUser.uid === productData.seller_id ||
                      currentUser.uid === productData.buyer_id) ? (
                      <p>
                        Completion Date:{" "}
                        {new Date(productData.completion_date).toLocaleString()}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>

                  <Divider sx={{ marginTop: 3, marginBottom: 3 }} />

                  <div>
                    {currentUser ? (
                      <div className="card-actions justify-end">
                        {productData.status !== "completed" &&
                        productData.seller_id === currentUser.uid ? (
                          <EditProduct productData={productData} />
                        ) : null}
                        {productData.status === "completed" &&
                        (productData.buyer_id === currentUser.uid ||
                          productData.seller_id === currentUser.uid) ? (
                          <Comment data={productData} />
                        ) : null}

                        {productData.status === "completed" &&
                        productData.buyer_id === currentUser.uid ? (
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
                        ) : null}

                        {productData.status === "active" &&
                        productData.seller_id !== currentUser.uid ? (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              // color="inherit"
                              onClick={async () => {
                                if (currentUser.uid) {
                                  socket.emit("join room", {
                                    room: productData.seller_id,
                                    user: currentUser.uid,
                                  });
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
                                onClick={() => {
                                  if (currentUser.uid) {
                                    removePossibleBuyer({
                                      variables: {
                                        id: productData._id,
                                        buyerId: currentUser.uid,
                                      },
                                    });
                                    // setIsPossibleBuyer(false);

                                    alert(
                                      "You're no longer a potential buyer ..."
                                    );
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
                                onClick={async () => {
                                  if (currentUser.uid) {
                                    await addPossibleBuyer({
                                      variables: {
                                        id: productData._id,
                                        buyerId: currentUser.uid,
                                      },
                                    });

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
                                      "You're a potential buyer now!\n\nFeel free to contact the seller for further information."
                                    );
                                  }
                                }}
                                sx={{ fontWeight: "bold", marginLeft: 3 }}
                              >
                                Buy
                              </Button>
                            )}

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
                          <>{/* <p>(You're the Poster)</p> */}</>
                        )}
                      </div>
                    ) : (
                      <p>
                        (Login to chat with seller or add product to favorite)
                      </p>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
}
