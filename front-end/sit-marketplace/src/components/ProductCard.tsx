import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import io from "socket.io-client";

import { Card, CardHeader, CardContent, Grid } from "@mui/material";

export default function ProductCard({ productData }) {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const socketRef = useRef();

  return (
    <Grid item>
      <Card
        sx={{ width: 300, height: "100%" }}
        style={{
          backgroundColor: "snow",
          borderRadius: "10%",
        }}
      >
        <CardHeader title={productData && productData.name}></CardHeader>
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

            <li>
              <button
                onClick={() => {
                  navigate(`/product/${productData._id}`);
                }}
              >
                Detail
              </button>
            </li>
            <li>
              <button
                hidden={currentUser ? false : true}
                onClick={() => {
                  if (currentUser.uid) {
                    socketRef.current = io("http://localhost:4001").emit(
                      "join room",
                      {
                        room: productData.seller_id,
                        user: currentUser.uid,
                      }
                    );
                  }
                }}
              >
                Chat with seller
              </button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </Grid>
  );
}
