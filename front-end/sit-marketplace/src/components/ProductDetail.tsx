// import { useEffect, useState, useContext } from "react";
// import ProductCard from "./ProductCard";
// import { useQuery } from "@apollo/client";
// import { SEARCH_PRODUCTS_BY_ID } from "../queries";
// import { useNavigate, useParams } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";
// import Comment from "./Comment.js";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useContext(AuthContext);

//   const { loading, error, data } = useQuery(SEARCH_PRODUCTS_BY_ID, {
//     variables: { id: id },
//     fetchPolicy: "cache-and-network",
//   });

//   if (loading) {
//     return <h1>Loading...</h1>;
//   } else if (error) {
//     return <h1>Error loading product</h1>;
//   } else {
//     const product = data.getProductById;

//     return (

//     );
//   }
// }
