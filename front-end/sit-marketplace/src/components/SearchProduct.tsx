import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS } from "../queries";

import ProductCard from "./ProductCard";

type Product = {
  _id: string;
  name: string;
};

export default function SearchProduct({ searchTerm }) {
  const [products, setProducts] = useState([]);

  const { loading, error, data } = useQuery(SEARCH_PRODUCTS, {
    variables: { searchTerm: searchTerm },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!loading && !error && data.searchProducts) {
      setProducts(data.searchProducts);
    }
  }, [loading]);

  if (data) {
    return (
      <div>
        <h2>Search Results for {searchTerm}:</h2>
        {products &&
          products.map((product: Product) => {
            return <ProductCard key={product._id} productData={product} />;
          })}
      </div>
    );
  }
}
