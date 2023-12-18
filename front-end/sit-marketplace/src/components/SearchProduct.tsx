import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_NAME } from "../queries";

import ProductCard from "./ProductCard";

type Product = {
  _id: string;
  name: string;
};

export default function SearchProduct({ searchTerm }) {
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS_BY_NAME, {
    variables: { name: searchTerm },
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    return (
      <div>
        <h2>Product Search Results for {searchTerm}:</h2>
        {data.length == 0 ? (
          <p>No Result Found</p>
        ) : (
          data.searchProductsByName.map((product: Product) => {
            return <ProductCard key={product._id} productData={product} />;
          })
        )}
      </div>
    );
  }
}
