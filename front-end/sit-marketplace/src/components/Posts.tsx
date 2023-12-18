import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_POSTS, GET_POSTS_BY_CATEGORY } from "../queries";

import PostCard from "./PostCard";
import SearchPost from "./SearchPost";
import { Link, Tabs, Tab } from "@mui/material";

type Post = {
  _id: string;
  title: string;
};

export default function Posts() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [curCategory, setCurCategory] = useState("All");

  const [value, setValue] = React.useState(0);
  const { loading, error, data } = useQuery(
    curCategory === "All" ? GET_POSTS : GET_POSTS_BY_CATEGORY,
    curCategory !== "All"
      ? {
          variables: { category: curCategory },
          fetchPolicy: "cache-and-network",
        }
      : { fetchPolicy: "cache-and-network" }
  );

  const category_list = [
    "All",
    "Book",
    "Electronics",
    "Clothing",
    "Furniture",
    "Stationary",
    "Other",
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return <p>Loading</p>;
  } else if (error) {
    return <p>Something went wrong {error.message}</p>;
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

        <Tabs
          value={value}
          onChange={(e, newValue) => handleChange(e, newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {category_list.map((category, idx) => (
            <Tab
              label={category}
              key={idx}
              value={idx}
              onClick={() => {
                setCurCategory(category);
              }}
            />
          ))}
        </Tabs>

        <h1>Posts:</h1>
        <button
          onClick={() => {
            navigate("/newpost");
          }}
        >
          New Post
        </button>

        {/* {posts &&
          posts.map((post: Post) => {
            return <PostCard key={post._id} postData={post} />;
          })} */}
        {data && curCategory === "All" && data.posts.length > 0
          ? data.posts.map((post: Post) => {
              return <PostCard key={post._id} postData={post} />;
            })
          : null}
        {data && curCategory === "All" && data.posts.length == 0 ? (
          <p>No result found</p>
        ) : null}
        {data && curCategory != "All" && data.getPostsByCategory.length > 0
          ? data.getPostsByCategory.map((post: Post) => {
              return <PostCard key={post._id} postData={post} />;
            })
          : null}
        {data && curCategory != "All" && data.getPostsByCategory.length == 0 ? (
          <p>No result found</p>
        ) : null}
      </div>
    );
  }
}
