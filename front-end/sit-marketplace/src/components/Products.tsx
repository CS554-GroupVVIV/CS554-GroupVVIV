import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../queries";

import ProductForm from "./ProductForm";
import ProductCard from "./ProductCard";

type Product = {
  _id: string;
  name: string;
};

export default function Products() {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("in the products useeffect");
    console.log(data);
    console.log(error);
    if (!loading && !error && data.products) {
      setProducts(data.products);
    } else if (error) {
      console.error(error);
    }
  }, [loading]);

  return (
    <div>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Home
      </button>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSearchTerm(text);
          setText("");
        }}
      >
        <label>
          Search Product:
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <input type="submit" />
      </form>

      {/* {searchTerm && <SearchProduct searchTerm={searchTerm} />} */}

      <ProductForm />

      <h1>Products:</h1>
      <button
        onClick={() => {
          navigate("/newproduct");
        }}
      >
        New Product
      </button>
      {data.products &&
        data.products.map((product: Product) => {
          return <ProductCard key={product._id} productData={product} />;
        })}
    </div>
  );
}
