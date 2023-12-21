import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_NAME } from "../queries";

import ProductCard from "./ProductCard.jsx";

import { Grid, Button, Typography } from "@mui/material";

export default function SearchProduct({ searchTerm, category }) {
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS_BY_NAME, {
    variables: { name: searchTerm, category: category },
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    return (
      <Grid item>
        <div style={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{
              // fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            Search Results for "{searchTerm}"
            {category ? ` (category: "${category}")` : null}:
          </Typography>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Grid container spacing={2} marginTop={1} justifyContent="center">
            {data && data.searchProductsByName.length !== 0 ? (
              data.searchProductsByName.map((product) => {
                return <ProductCard key={product._id} productData={product} />;
              })
            ) : (
              <p>No result found</p>
            )}
          </Grid>
        </div>
      </Grid>
    );
  }
}
