import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  //   useEffect(() => {
  //     if (!loading && !error && data.posts) {
  //       setPosts(data.posts);
  //     }
  //   }, [loading]);

  return (
    <div>
      <h1>Posts:</h1>
      <button
        onClick={() => {
          navigate("/newpost");
        }}
      >
        New Post
      </button>
      {posts &&
        posts.map((post: Post) => {
          return <PostCard key={post._id} postData={post} />;
        })}
    </div>
  );
}
