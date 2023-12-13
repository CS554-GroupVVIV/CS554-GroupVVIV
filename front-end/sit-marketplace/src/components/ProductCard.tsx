import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import io from "socket.io-client";

import ChatRoom from "./ChatRoom";

export default function ProductCard({ productData }) {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);

  const socketRef = useRef();

  return (
    <article>
      <h4>Name: {productData && productData.name}</h4>
      <ul>
        <li>Price: {productData && productData.price}</li>
        <li>Date: {productData && productData.date}</li>
        <li>Description: {productData && productData.description}</li>
        <li>Condition: {productData && productData.condition}</li>
        <li>Category: {productData && productData.category}</li>
      </ul>
      <button
        onClick={() => {
          navigate(`/product/${productData._id}`);
        }}
      >
        Detail
      </button>
      <button
        hidden={currentUser ? false : true}
        onClick={() => {
          if (currentUser.uid) {
            socketRef.current = io("http://localhost:4001").emit("join room", {
              room: productData.seller_id,
              user: currentUser.uid,
            });
          }
        }}
      >
        Chat with seller
      </button>
    </article>
  );
}
