import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { SEARCH_POSTS } from "../queries";

import PostCard from "./PostCard";

import { Grid, Button, Typography } from "@mui/material";

export default function SearchPost({ searchTerm }) {
  const { loading, error, data } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: searchTerm },
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
            {data &&
              data.searchPosts.map((post) => {
                return <PostCard key={post._id} postData={post} />;
              })}
          </Grid>
        </div>
      </Grid>
    );
  }
}
