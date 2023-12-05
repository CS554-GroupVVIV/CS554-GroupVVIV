import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../queries";

import ProductCard from "./ProductCard";

type Product = {
  _id: string;
  name: string;
};

export default function Products() {
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!loading && !error && data.products) {
      setProducts(data.products);
    }
  }, [loading]);

  return (
    <div>
      <h1>Products:</h1>
      {products &&
        products.map((product: Product) => {
          return <ProductCard key={product._id} productData={product} />;
        })}
    </div>
  );
}
