import React from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
import PostCard from "./PostCard";
import { Container, Typography, Grid, Box } from "@mui/material";
import FavoriteProduct from "./FavoriteProduct";
import FavoritePost from "./FavoritePost";
import Divider from "@mui/material/Divider";

const FavoriteHolder = ({ favorite, favorite_post }) => {
  // const FavoriteProduct = ({ favId }) => {
  //   const { data, loading, error } = useQuery(SEARCH_PRODUCTS_BY_ID, {
  //     variables: { id: favId },
  //   });
  //   if (data) {
  //     return <ProductCard productData={data.getProductById} />;
  //   }
  // };

  console.log(favorite);
  console.log(favorite_post);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Divider>My Favorite products</Divider>
      <br></br>
      <Grid container spacing={3}>
        {favorite && favorite.length == 0 ? (
          <Typography variant="body1">No Result Found</Typography>
        ) : (
          favorite.map((fav, index) => (
            <Grid item xs={4} md={4} lg={4} key={index}>
              <FavoriteProduct favId={fav} />
            </Grid>
          ))
        )}
      </Grid>
      <br></br>

      <Divider>My Favorite posts</Divider>
      <br></br>

      <Grid container spacing={3}>
        {favorite_post && favorite_post.length == 0 ? (
          <Typography variant="body1">No Result Found</Typography>
        ) : (
          favorite_post &&
          favorite_post.map((fav, index) => (
            <Grid item xs={4} md={4} lg={4} key={index}>
              <FavoritePost favId={fav} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default FavoriteHolder;
