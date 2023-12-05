import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../queries";

import PostCard from "./PostCard";

type Post = {
  _id: string;
  title: string;
};

export default function Products() {
  //   const { loading, error, data } = useQuery(GET_POSTS, {
  //     fetchPolicy: "cache-and-network",
  //   });

  const [posts, setPosts] = useState([]);

  //   useEffect(() => {
  //     if (!loading && !error && data.posts) {
  //       setPosts(data.posts);
  //     }
  //   }, [loading]);

  return (
    <div>
      <h1>Posts:</h1>
      {posts &&
        posts.map((post: Post) => {
          return <PostCard key={post._id} postData={post} />;
        })}
    </div>
  );
}
