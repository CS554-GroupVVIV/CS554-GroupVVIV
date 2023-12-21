import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS_BY_STATUS, GET_POSTS_BY_STATUS } from "../queries";

import ProductCard from "./ProductCard";
import { AuthContext } from "../context/AuthContext";

import { Grid, Button, Typography, Divider } from "@mui/material";
import PostCard from "./PostCard";

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

  return (
    <div style={{ marginTop: 80 }}>
      <Grid
        container
        direction={"column"}
        spacing={3}
        mt={1}
        pl={"10%"}
        pr={"10%"}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid
          item
          sx={{
            width: "80%",
          }}
        >
          <Typography variant="h4" fontWeight={"bold"}>
            👋 Welcome to Stevens Marketplace!
          </Typography>

          <Typography variant="body1" fontWeight={"bold"} mt={3}>
            This is a Web APP for the Stevens community to purchase and request
            high-quality items from alumni, current students, and faculty.
          </Typography>
        </Grid>

        <Divider
          sx={{
            mt: 3,
          }}
        />

        <Grid item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                width: "80%",
              }}
            >
              👉 Products:
            </Typography>
            <Grid container justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                // color="inherit"
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
                maxWidth: "75vw",
              }}
              p={3}
            >
              {productData &&
                productData.getProductsByStatus.slice(0, 10).map((product) => {
                  return (
                    <ProductCard key={product._id} productData={product} />
                  );
                })}
            </Grid>
          </div>
        </Grid>
        <Divider />
        <Grid item>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography
              variant="h4"
              sx={{
                // fontFamily: "monospace",
                fontWeight: "bold",
                minWidth: "80%",
              }}
            >
              👉 Posts:
            </Typography>
            <Grid container justifyContent="flex-end">
              <Button
                size="small"
                variant="contained"
                // color="inherit"
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
                maxWidth: "75vw",
              }}
              p={3}
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
