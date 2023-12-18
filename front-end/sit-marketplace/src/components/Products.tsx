import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard";

import SearchProduct from "./SearchProduct";
import { GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from "../queries";
import { Link, Tabs, Tab } from "@mui/material";

type Product = {
  _id: string;
  name: string;
};

export default function Products() {
  const navigate = useNavigate();
  const [curCategory, setCurCategory] = useState("All");
  const { currentUser } = useContext(AuthContext);
  const category_list = [
    "All",
    "Book",
    "Electronics",
    "Clothing",
    "Furniture",
    "Stationary",
    "Other",
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

  if (data) {
    // console.log(data);
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

        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {category_list.map((category) => (
            <Link
              onClick={() => {
                setCurCategory(category);
              }}
            >
              <Tab label={category} />
            </Link>
          ))}
        </Tabs>

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
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            New Product
          </button>
        )}

        {data && curCategory === "All" && data.products.length > 0
          ? data.products.map((product: Product) => {
              return <ProductCard key={product._id} productData={product} />;
            })
          : null}
        {data && curCategory === "All" && data.products.length == 0 ? (
          <p>No result found</p>
        ) : null}
        {data && curCategory != "All" && data.getProductsByCategory.length > 0
          ? data.getProductsByCategory.map((product: Product) => {
              return <ProductCard key={product._id} productData={product} />;
            })
          : null}
        {data &&
        curCategory != "All" &&
        data.getProductsByCategory.length == 0 ? (
          <p>No result found</p>
        ) : null}
      </div>
    );
  }
}
