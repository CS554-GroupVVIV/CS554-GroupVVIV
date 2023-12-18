import React from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
import ProductCard from "./ProductCard";
import PostCard from "./PostCard";
import { Container, Typography, Grid, Box } from "@mui/material";

const FavoriteHolder = ({ favorite }) => {
  const FavoriteProduct = ({ favId }) => {
    const { data, loading, error } = useQuery(SEARCH_PRODUCTS_BY_ID, {
      variables: { id: favId },
    });
    if (data) {
      return <ProductCard productData={data.getProductById} />;
    }
  };

  console.log(favorite);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {favorite.length == 0 ? (
          <Typography variant="body1">No Result Found</Typography>
        ) : (
          favorite.map((fav, index) => (
            <Grid item xs={4} md={4} lg={4} key={index}>
              <FavoriteProduct favId={fav} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default FavoriteHolder;
