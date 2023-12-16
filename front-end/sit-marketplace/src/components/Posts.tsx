import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../queries";

import PostCard from "./PostCard";
import SearchPost from "./SearchPost";

type Post = {
  _id: string;
  title: string;
};

export default function Posts() {
  const { data, loading, error } = useQuery(GET_POSTS, {
    fetchPolicy: "cache-and-network",
  });
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <p>Loading</p>;
  } else if (error) {
    return <p>Something went wrong {error}</p>;
  } else if (data) {
    const posts = data.posts;
    // console.log(posts);
    return (
      <div>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </button>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearchTerm(text);
            setText("");
          }}
        >
          <label>
            Search Post:
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <input type="submit" />
        </form>

        {searchTerm && <SearchPost searchTerm={searchTerm} />}

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
}
