import React, { useState, useEffect } from "react";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../queries";

function Home() {
  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const [products, setProducts] = useState(undefined);

  useEffect(() => {
    if (!loading && !error && data.products) {
      setProducts(data.products);
    }
  }, [loading, data]);

  return (
    <div>
      <h1>Home</h1>

      <h2>Products:</h2>
      <ul>
        {products &&
          products.map((product) => {
            return <li key={product._id}>{product.name}</li>;
          })}
      </ul>
    </div>
  );
}

export default Home;
