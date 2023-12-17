import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import noImage from "../assets/noimage.jpg";
import { AuthContext } from "../context/AuthContext";

import { socketID, socket } from "./socket";

import { Card, CardHeader, CardContent, Grid, Link } from "@mui/material";

import { ADD_FAVORITE_TO_USER, REMOVE_FAVORITE_FROM_USER } from "../queries";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries";

export default function ProductDetailCard({ productData }) {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const [hasFavorited, setHasFavorited] = useState(false);

  const { data: userData } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const baseUrl = "/product/";

  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(REMOVE_FAVORITE_FROM_USER);

  const [addFavorite, { addData, addLoading, addError }] =
    useMutation(ADD_FAVORITE_TO_USER);

  useEffect(() => {
    if (userData?.getUserById?.favorite?.includes(productData._id)) {
      setHasFavorited(true);
    }
  }, [userData]);

  function handleFavorite() {
    console.log("user id", currentUser.uid);
    console.log("product id", productData._id);

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
      console.log(error.message);
    }
    // if (addError || removeError) {
    //   console.log(addError);
    //   console.log(removeError);
    // }
  }

  return (
    <Grid item>
      <Card
        sx={{ width: 300, height: "100%" }}
        style={{
          backgroundColor: "snow",
          borderRadius: "10%",
        }}
      >
        <Link onClick={() => navigate(baseUrl + productData._id)}>
          <CardHeader title={productData && productData.name}></CardHeader>
        </Link>
        <CardContent
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ul>
            <li>Price: {productData && productData.price}</li>
            <li>Date: {productData && productData.date}</li>
            <li>Description: {productData && productData.description}</li>
            <li>Condition: {productData && productData.condition}</li>
            <li>Category: {productData && productData.category}</li>
          </ul>
          <div className="image">
            {productData && productData.image ? (
              <img
                src={productData.image}
                alt="product image"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <img
                src={noImage}
                alt="product image"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
          <button
            hidden={
              !currentUser || productData.seller_id === currentUser.uid
                ? true
                : false
            }
            onClick={() => {
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
          >
            Chat with seller
          </button>

          <button
            hidden={
              !currentUser || productData.seller_id === currentUser.uid
                ? true
                : false
            }
            onClick={handleFavorite}
          >
            {hasFavorited ? <p>Favorited</p> : <p>Favorite</p>}
          </button>
        </CardContent>
      </Card>
    </Grid>
  );
}
