import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_STATUS, GET_POSTS_BY_STATUS } from "../queries";

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
  } = useQuery(GET_PRODUCTS_BY_STATUS, {
    variables: { status: "active" },
    fetchPolicy: "cache-and-network",
  });

  const {
    loading: postLoading,
    error: postError,
    data: postData,
  } = useQuery(GET_POSTS_BY_STATUS, {
    variables: { status: "active" },
    fetchPolicy: "cache-and-network",
  });

  // console.log(currentUser);
  return (
    <div style={{ marginTop: 50 }}>
      <Grid
        container
        direction={"column"}
        spacing={5}
        mt={1}
        pl={"10%"}
        pr={"10%"}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h5"
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
                size="small"
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
                productData.getProductsByStatus
                  .slice(0, 10)
                  .map((product: Product) => {
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
              variant="h5"
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
                size="small"
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
                postData.getPostsByStatus.slice(0, 10).map((post) => {
                  return <PostCard key={post._id} postData={post} />;
                })}
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
