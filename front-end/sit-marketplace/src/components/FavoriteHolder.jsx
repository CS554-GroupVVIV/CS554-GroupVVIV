import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import FavoriteProduct from "./FavoriteProduct";
import FavoritePost from "./FavoritePost";
import Divider from "@mui/material/Divider";

const FavoriteHolder = ({ favorite, favorite_post }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Divider>My Favorite products</Divider>
      <br></br>
      <Grid container spacing={3}>
        {favorite && favorite.length == 0 ? (
          <Typography variant="body1">No Result Found</Typography>
        ) : (
          favorite &&
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
