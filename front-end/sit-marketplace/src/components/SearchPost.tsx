import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { SEARCH_POSTS } from "../queries";

import PostCard from "./PostCard";

export default function SearchPost({ searchTerm }) {
  const { loading, error, data } = useQuery(SEARCH_POSTS, {
    variables: { searchTerm: searchTerm },
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    return (
      <div>
        <h2>Post Search Results for {searchTerm}:</h2>
        {data &&
          data.searchPosts.map((post) => {
            return <PostCard key={post._id} postData={post} />;
          })}
      </div>
    );
  }
}
