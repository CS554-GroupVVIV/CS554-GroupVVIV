import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard";

import SearchProduct from "./SearchProduct";
import { GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from "../queries";
import { Link } from "@mui/material";

type Product = {
  _id: string;
  name: string;
};

export default function Products() {
  const navigate = useNavigate();
  const [curCategory, setCurCategory] = useState("all");
  const { currentUser } = useContext(AuthContext);
  const category_list = [
    "All",
    "Book",
    "Electronics",
    "Clothing",
    "Furniture",
    "Stationary",
  ];

  const { loading, error, data } = useQuery(
    curCategory === "All" ? GET_PRODUCTS : GET_PRODUCTS_BY_CATEGORY,
    curCategory !== "All"
      ? {
          variables: { category: curCategory },
          fetchPolicy: "cache-and-network",
        }
      : { fetchPolicy: "cache-and-network" }
  );

  console.log("product data", data);

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

      <ul className="ProductCategory">
        {category_list.map((category) => (
          <li key={category}>
            <Link
              onClick={() => {
                setCurCategory(category);
              }}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>

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

      {data && curCategory === "All"
        ? data.products?.map((product: Product) => {
            return <ProductCard key={product._id} productData={product} />;
          })
        : data &&
          data.getProductsByCategory?.map((product: Product) => {
            return <ProductCard key={product._id} productData={product} />;
          })}
    </div>
  );
}
