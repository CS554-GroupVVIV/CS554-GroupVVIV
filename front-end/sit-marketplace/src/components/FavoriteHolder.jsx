import React from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import FavoriteProduct from "./FavoriteProduct";

const FavoriteHolder = ({ favorite }) => {

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
