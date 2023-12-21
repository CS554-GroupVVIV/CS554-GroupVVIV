import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { SEARCH_POSTS } from "../queries";

import PostCard from "./PostCard.jsx";

import { Grid, Button, Typography } from "@mui/material";

export default function SearchPost({ searchTerm, category }) {
  const { loading, error, data } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: searchTerm, category: category },
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
            {data && data.searchPosts.length !== 0 ? (
              data.searchPosts.map((post) => {
                {
                  if (post.status === "active") {
                    return <PostCard key={post._id} postData={post} />;
                  }
                }
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
