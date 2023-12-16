import { useEffect, useState, useContext } from "react";
import ProductCard from "./ProductCard";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
import { useNavigate, useParams } from "react-router-dom";
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

export default function FavoriteProduct({ favId }) {
  const baseUrl = "/product/";
  //   console.log("favorite product!", favId);
  const navigate = useNavigate();
  const {
    loading,
    error,
    data: productData,
  } = useQuery(SEARCH_PRODUCTS_BY_ID, {
    variables: { id: favId },
    fetchPolicy: "cache-and-network",
  });

  console.log("product data", productData);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error loading product</h1>;
  }

  return (
    <div>
      <Link onClick={() => navigate(baseUrl + favId)}>
        {productData.getProductById.name}
      </Link>
      <p>{productData.getProductById.price}</p>
    </div>
  );
}
