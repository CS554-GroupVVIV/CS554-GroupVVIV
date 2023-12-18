import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../assets/noimage.jpg";
import { AuthContext } from "../context/AuthContext";
import EditProduct from "./EditProduct.tsx";
import { socketID, socket } from "./socket";
import Comment from "./Comment.tsx";

import { Card, CardHeader, CardContent, Grid, Link } from "@mui/material";

import {
  ADD_FAVORITE_TO_USER,
  REMOVE_FAVORITE_FROM_USER,
  SEARCH_PRODUCTS_BY_ID,
  GET_USER,
  ADD_POSSIBLE_BUYER,
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
  const { data: userData } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const baseUrl = "/product/";

  const [addPossibleBuyer] = useMutation(ADD_POSSIBLE_BUYER);

  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(REMOVE_FAVORITE_FROM_USER);

  const [addFavorite, { addData, addLoading, addError }] =
    useMutation(ADD_FAVORITE_TO_USER);

  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    console.log(data, userData);
    if (data && userData && userData.getUserById) {
      if (userData.getUserById.favorite.includes(data.getProductById._id)) {
        console.log(userData.getUserById.favorite);
        setHasFavorited(true);
      }
    }
  }, [userData, data]);

  function handleFavorite(productData) {
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
  if (data) {
    const productData = data.getProductById;
    return (
      <div className="card w-96 bg-base-100 shadow-xl border-indigo-500/100">
        <div className="card-body">
          <p className="card-title">Detail of Product</p>
          {productData.status !== "completed" &&
          currentUser &&
          currentUser.uid == productData.seller_id &&
          !showEditForm ? (
            <button onClick={() => setShowEditForm(true)}>Edit</button>
          ) : null}
          {showEditForm ? <EditProduct productData={productData} /> : null}
          <p>Item: {productData.name}</p>
          <p>Seller Id: {productData.seller_id}</p>
          {productData.status == "completed" &&
          currentUser &&
          (currentUser.uid == productData.seller_id ||
            currentUser.uid == productData.buyer_id) ? (
            <p>Buyer Id: {productData.buyer_id}</p>
          ) : null}
          <p>Category: {productData.category}</p>
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
          <p>Price: {productData.price}</p>
          <p>Transaction Date: {productData.date.split("T")[0]}</p>
          <p>Status: {productData.status}</p>
          {currentUser ? (
            <div>
              <div className="card-actions justify-end">
                <button
                  hidden={
                    !currentUser || productData.seller_id === currentUser.uid
                      ? true
                      : false
                  }
                  onClick={() => handleFavorite(productData)}
                >
                  {hasFavorited ? <p>Favorited</p> : <p>Favorite</p>}
                </button>
                {productData.seller_id == currentUser.uid &&
                productData.status == "active" ? (
                  <button
                  // onClick={() => {
                  //   retrieve(product);
                  // }}
                  >
                    Retrieve Product
                  </button>
                ) : null}
                {productData.seller_id == currentUser.uid &&
                productData.status == "inactive" ? (
                  <button
                  // onClick={() => {
                  //   repost(product);
                  // }}
                  >
                    Repost
                  </button>
                ) : null}
                {productData.status == "completed" &&
                (productData.buyer_id == currentUser.uid ||
                  productData.seller_id == currentUser.uid) ? (
                  <Comment data={productData} />
                ) : null}
                {productData.status == "active" &&
                productData.seller_id != currentUser.uid ? (
                  <button
                    hidden={
                      !currentUser || productData.seller_id === currentUser.uid
                        ? true
                        : false
                    }
                    onClick={() => {
                      if (currentUser.uid) {
                        addPossibleBuyer({
                          variables: {
                            id: data.getProductById._id,
                            buyerId: userData.getUserById._id,
                          },
                        });
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
                ) : null}
              </div>
            </div>
          ) : (
            <div>
              <button onClick={() => navigate("/login")}>
                Log In to konw more
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
