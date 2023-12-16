import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS, GET_POSTS } from "../queries";

import ProductCard from "./ProductCard";
import LogoutButton from "./LogoutButton";
import { AuthContext } from "../context/AuthContext";

import ChatRoomList from "./ChatRoomList";
import SearchProduct from "./SearchProduct";
import SearchPost from "./SearchPost";

import { Grid } from "@mui/material";
import PostCard from "./PostCard";

type Product = {
  _id: string;
  name: string;
};

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const {
    loading: productLoading,
    error: productError,
    data: productData,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const {
    loading: postLoading,
    error: postError,
    data: postData,
  } = useQuery(GET_POSTS, {
    fetchPolicy: "cache-and-network",
  });

  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // console.log(currentUser);
  return (
    <div>
      {currentUser ? (
        <>
          <LogoutButton />
          <button
            className="userprofile"
            onClick={() => {
              navigate("/userprofile");
            }}
          >
            User Profile
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </button>
        </>
      )}

      <h1>Home</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSearchTerm(text);
          setText("");
        }}
      >
        <label>
          Search:
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <input type="submit" />
      </form>

      {searchTerm && <SearchProduct searchTerm={searchTerm} />}
      {searchTerm && <SearchPost searchTerm={searchTerm} />}

      <Grid container direction={"row"} spacing={2} marginTop={1}>
        <Grid item>
          <div style={{ textAlign: "center" }}>
            <h2>First 10 Products:</h2>
            <button
              onClick={() => {
                navigate("/products");
              }}
            >
              More
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={2}
              style={{
                overflowX: "auto",
                flexWrap: "nowrap",
                padding: "16px",
                maxWidth: "60vw",
              }}
            >
              {productData &&
                productData.products.map((product: Product) => {
                  return (
                    <ProductCard key={product._id} productData={product} />
                  );
                })}
            </Grid>
          </div>

          <div style={{ textAlign: "center" }}>
            <h2>First 10 Posts:</h2>
            <button
              onClick={() => {
                navigate("/posts");
              }}
            >
              More
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={2}
              style={{
                overflowX: "auto",
                flexWrap: "nowrap",
                padding: "16px",
                maxWidth: "60vw",
              }}
            >
              {postData &&
                postData.posts.map((post) => {
                  return <PostCard key={post._id} postData={post} />;
                })}
            </Grid>
          </div>
        </Grid>
        <Grid item>
          <div>
            {currentUser ? (
              <ChatRoomList uid={currentUser.uid} />
            ) : (
              <h4>Please Login to chat</h4>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
