import React from "react";
import ProductCard from "./ProductCard";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
const Favorite = ({ favorite }) => {
  const FavoriteProduct = ({ favId }) => {
    const { data, loading, error } = useQuery(SEARCH_PRODUCTS_BY_ID, {
      variables: { id: favId },
    });
    if (data) {
      return <ProductCard productData={data.getProductById} />;
    }
  };
  if (favorite && favorite.length > 0) {
    return favorite.map((fav) => <FavoriteProduct key={fav} favId={fav} />);
  }
  if (favorite && favorite.length == 0) {
    return <p>No Favorite</p>;
  }
};

export default Favorite;
