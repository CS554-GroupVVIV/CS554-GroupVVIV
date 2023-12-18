import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_NAME } from "../queries";

import ProductCard from "./ProductCard";

import { Grid, Button, Typography } from "@mui/material";

type Product = {
  _id: string;
  name: string;
};

export default function SearchProduct({ searchTerm }) {
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS_BY_NAME, {
    variables: { name: searchTerm },
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    return (
      <Grid item>
        <div style={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              // fontFamily: "monospace",
              fontWeight: "bold",
            }}
          >
            Search Results for "{searchTerm}" :
          </Typography>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            spacing={2}
            style={{
              overflowX: "auto",
              flexWrap: "nowrap",
              padding: "16px",
              maxWidth: "80vw",
            }}
          >
            {data.length == 0 ? (
              <p>No Result Found</p>
            ) : (
              data.searchProductsByName.map((product: Product) => {
                return <ProductCard key={product._id} productData={product} />;
              })
            )}
          </Grid>
        </div>
      </Grid>
    );
  }
}
