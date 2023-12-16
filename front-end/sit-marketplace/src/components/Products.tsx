import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../queries";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard";

import SearchProduct from "./SearchProduct";
import { GET_PRODUCTS_BY_CATEGORY } from "../queries";

type Product = {
  _id: string;
  name: string;
};

export default function Products() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  console.log(data);

  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

      {searchTerm && <SearchProduct searchTerm={searchTerm} />}

      <h1>Products:</h1>
      {currentUser ? (
        <button
          onClick={() => {
            navigate("/newproduct");
          }}
        >
          New Product
        </button>
      ) : (
        <></>
      )}

      {data &&
        data.products.map((product: Product) => {
          return <ProductCard key={product._id} productData={product} />;
        })}
    </div>
  );
}
