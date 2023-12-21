import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_POSTS, GET_POSTS_BY_CATEGORY } from "../queries";

import { AuthContext } from "../context/AuthContext";

import PostCard from "./PostCard";
import SearchPost from "./SearchPost";
import {
  Link,
  Tabs,
  Tab,
  Grid,
  Button,
  Typography,
  TextField,
} from "@mui/material";

export default function Posts() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [curCategory, setCurCategory] = useState("All");

  const { currentUser } = useContext(AuthContext);

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
    return (
      <div style={{ marginTop: 70, padding: 10 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h4" margin={1} fontWeight={"bold"}>
            Posts
          </Typography>
          <Grid container justifyContent="flex-end">
            {currentUser ? (
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  navigate("/newpost");
                }}
                sx={{ marginRight: 2 }}
              >
                Add New Post
              </Button>
            ) : (
              <></>
            )}
          </Grid>
        </div>

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

        <div style={{ display: "flex", justifyContent: "center" }}>
          <TextField
            variant="standard"
            label="Search"
            value={text}
            autoComplete="off"
            onInput={(e) => setText(e.target.value)}
            InputLabelProps={{
              sx: {
                // fontFamily: "monospace",
                fontWeight: "bold",
              },
            }}
            style={{
              // fontFamily: "monospace",
              fontWeight: "bold",
              color: "#424242",
              marginRight: 5,
            }}
            sx={{ minWidth: 400 }}
          />
          <Button
            size="small"
            variant="contained"
            color="inherit"
            sx={{ marginLeft: 3 }}
            onClick={(event) => {
              event.preventDefault();
              setSearchTerm(text);
            }}
          >
            Search
          </Button>
          {searchTerm ? (
            <Button
              size="small"
              variant="contained"
              color="inherit"
              sx={{ marginLeft: 3 }}
              onClick={(event) => {
                event.preventDefault();
                setSearchTerm("");
                setText("");
              }}
            >
              Clear Search
            </Button>
          ) : (
            <></>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            spacing={5}
            marginTop={1}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {searchTerm && (
              <SearchPost
                searchTerm={searchTerm}
                category={curCategory === "All" ? null : curCategory}
              />
            )}
          </Grid>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {searchTerm ? (
            <></>
          ) : (
            <Grid container spacing={2} marginTop={1} justifyContent="center">
              {/* {posts &&
          posts.map((post: Post) => {
            return <PostCard key={post._id} postData={post} />;
          })} */}
              {data && curCategory === "All" && data.posts.length > 0
                ? data.posts.map((post) => {
                    return <PostCard key={post._id} postData={post} />;
                  })
                : null}
              {data && curCategory === "All" && data.posts.length == 0 ? (
                <p>No result found</p>
              ) : null}
              {data &&
              curCategory != "All" &&
              data.getPostsByCategory.length > 0
                ? data.getPostsByCategory.map((post) => {
                    return <PostCard key={post._id} postData={post} />;
                  })
                : null}
              {data &&
              curCategory != "All" &&
              data.getPostsByCategory.length == 0 ? (
                <p>No result found</p>
              ) : null}
            </Grid>
          )}
        </div>
      </div>
    );
  }
}
