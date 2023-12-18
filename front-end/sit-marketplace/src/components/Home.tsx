import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS, GET_POSTS } from "../queries";

import ProductCard from "./ProductCard";
import LogoutButton from "./LogoutButton";
import { AuthContext } from "../context/AuthContext";

import SearchProduct from "./SearchProduct";
import SearchPost from "./SearchPost";

import { Grid, Button, Typography, TextField } from "@mui/material";
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
    <div style={{ marginTop: "5%" }}>
      <Grid
        container
        spacing={5}
        marginTop={1}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{
                // fontFamily: "monospace",
                fontWeight: "bold",
                minWidth: "50%",
              }}
            >
              First 10 Products:
            </Typography>
            <Grid container justifyContent="flex-end">
              <Button
                size="large"
                variant="contained"
                color="inherit"
                onClick={() => {
                  navigate("/products");
                }}
              >
                More
              </Button>
            </Grid>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={2}
              style={{
                overflowX: "auto",
                flexWrap: "nowrap",
                padding: "16px",
                maxWidth: "75vw",
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
        </Grid>

        <Grid item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{
                // fontFamily: "monospace",
                fontWeight: "bold",
                minWidth: "50%",
              }}
            >
              First 10 Posts:
            </Typography>
            <Grid container justifyContent="flex-end">
              <Button
                size="large"
                variant="contained"
                color="inherit"
                onClick={() => {
                  navigate("/posts");
                }}
              >
                More
              </Button>
            </Grid>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={2}
              style={{
                overflowX: "auto",
                flexWrap: "nowrap",
                padding: "16px",
                maxWidth: "75vw",
              }}
            >
              {postData &&
                postData.posts.map((post) => {
                  return <PostCard key={post._id} postData={post} />;
                })}
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
