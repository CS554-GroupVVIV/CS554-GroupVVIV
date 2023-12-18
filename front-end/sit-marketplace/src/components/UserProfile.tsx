import React, { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useQuery } from "@apollo/client";
import { GET_USER, GET_PRODUCTS_BY_IDS } from "../queries.ts";
import TransactionPost from "./TransactionPost.tsx";
import TransactionProduct from "./TransactionProduct.tsx";
import Favorite from "./Favorite.tsx";
import * as validation from "../helper.tsx";
import { useApolloClient } from "@apollo/client";
import { FetchPolicy } from "@apollo/client";
// import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FavoriteProduct from "./FavoriteProduct.tsx";
import UserInfo from "./UserInfo.tsx";

function UserProfile() {
  let { currentUser } = useContext(AuthContext);
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });
  const [favorite, setFavorite] = useState([]);
  const baseUrl = "http://localhost:5173/product/";
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [togglePost, setTogglePost] = useState<boolean>(false);
  const [toogleProduct, setToggleProduct] = useState<boolean>(false);
  const [toogleFavorite, setToggleFavorite] = useState<boolean>(false);

  const [toogleUpdateUser, setToggleUpdateUser] = useState<boolean>(false);

  useEffect(() => {
    if (!loading && !error && data && data.getUserById) {
      console.log("in the if");
      setFavorite(data.getUserById.favorite);
      console.log("favorite", data.getUserById.favorite);
    }
  }, [loading, error, data]);

  if (loading) return "Loading...";
  if (error) return "Error";

  return (
    <div className="card">
      <h1>User Profile</h1>
      {toogleUpdateUser ? (
        <UserInfo data={data} />
      ) : (
        <div className="form-group">
          <p>First Name: {data.getUserById.firstname}</p>
          <p>Last Name: {data.getUserById.lastname}</p>
          <p>Email: {data.getUserById.email}</p>
        </div>
      )}
      <button
        onClick={() => {
          setToggleUpdateUser(!toogleUpdateUser);
        }}
      >
        Edit User Info
      </button>
      <br />
      <button
        onClick={() => {
          setTogglePost(!togglePost);
        }}
      >
        Transaction from Post
      </button>
      <br />
      {togglePost ? <TransactionPost /> : null}
      <button
        onClick={() => {
          setToggleProduct(!toogleProduct);
        }}
      >
        Transaction from Product
      </button>
      {toogleProduct ? <TransactionProduct /> : null}
      <br />
      <button
        onClick={() => {
          setToggleFavorite(!toogleFavorite);
        }}
      >
        My Favorite Products
      </button>
      {toogleFavorite ? <Favorite favorite={favorite} /> : null}
    </div>
  );
}

export default UserProfile;
