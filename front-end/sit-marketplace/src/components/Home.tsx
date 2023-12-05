import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS, GET_POSTS } from "../queries";

import ProductCard from "./ProductCard";

type Product = {
  _id: string;
  name: string;
};

export default function Home() {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const [firstTenProducts, setFirstTenProducts] = useState([]);

  useEffect(() => {
    if (!loading && !error && data.products) {
      setFirstTenProducts(data.products.slice(0, 10));
    }
  }, [loading]);

  return (
    <div>
      <h1>Home</h1>

      <div>
        <h2>First 10 Products:</h2>
        {firstTenProducts &&
          firstTenProducts.map((product: Product) => {
            return <ProductCard key={product._id} productData={product} />;
          })}
        <button
          onClick={() => {
            navigate("/products");
          }}
        >
          More
        </button>
      </div>

      <div>
        <h2>First 10 Posts:</h2>
        <button
          onClick={() => {
            navigate("/posts");
          }}
        >
          More
        </button>
      </div>
    </div>
  );
}
