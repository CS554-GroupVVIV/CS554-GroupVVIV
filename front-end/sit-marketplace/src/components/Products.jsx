import React, { useState, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard.jsx";

import SearchProduct from "./SearchProduct";
import { GET_PRODUCTS, GET_PRODUCTS_BY_CATEGORY } from "../queries";
import {
  Link,
  Tabs,
  Tab,
  Grid,
  Button,
  Typography,
  TextField,
} from "@mui/material";

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { loading, error, data } = useQuery(
    curCategory === "All" ? GET_PRODUCTS : GET_PRODUCTS_BY_CATEGORY,
    curCategory !== "All"
      ? {
          variables: { category: curCategory },
          fetchPolicy: "cache-and-network",
        }
      : { fetchPolicy: "cache-and-network" }
  );

  const [text, setText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  if (data) {
    // console.log(data);
    return (
      <div style={{ marginTop: 70, padding: 10 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h4" margin={1} fontWeight={"bold"}>
            Products
          </Typography>
          <Grid container justifyContent="flex-end">
            {currentUser ? (
              <Button
                variant="contained"
                // color="inherit"
                onClick={() => {
                  navigate("/newproduct");
                }}
                sx={{ marginRight: 2 }}
              >
                Add New Product
              </Button>
            ) : (
              <></>
            )}
          </Grid>
        </div>

        <Tabs
          value={value}
          onChange={(e, newValue) => handleChange(e, newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {category_list.map((category, idx) => (
            <Tab
              label={category}
              key={idx}
              value={idx}
              onClick={() => {
                setCurCategory(category);
              }}
            />
          ))}
        </Tabs>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <TextField
            variant="standard"
            label="Search"
            value={text}
            onInput={(e) => setText(e.target.value)}
            autoComplete="off"
            InputLabelProps={{
              sx: {
                // fontFamily: "monospace",
                fontWeight: "bold",
              },
            }}
            style={{
              // fontFamily: "monospace",
              fontWeight: "bold",
              color: "#424242",
              marginRight: 5,
            }}
            sx={{ minWidth: 400 }}
          />
          <Button
            size="small"
            variant="contained"
            // color="inherit"
            sx={{ marginLeft: 3 }}
            onClick={(event) => {
              event.preventDefault();
              setSearchTerm(text);
            }}
          >
            Search
          </Button>
          {searchTerm ? (
            <Button
              size="small"
              variant="contained"
              // color="inherit"
              sx={{ marginLeft: 3 }}
              onClick={(event) => {
                event.preventDefault();
                setSearchTerm("");
                setText("");
              }}
            >
              Clear Search
            </Button>
          ) : (
            <></>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            spacing={5}
            marginTop={1}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {searchTerm && (
              <SearchProduct
                searchTerm={searchTerm}
                category={curCategory === "All" ? null : curCategory}
              />
            )}
          </Grid>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {searchTerm ? (
            <></>
          ) : (
            <Grid container spacing={2} marginTop={1} justifyContent="center">
              {data && curCategory === "All" && data.products.length > 0
                ? data.products.map((product) => {
                    return (
                      <ProductCard key={product._id} productData={product} />
                    );
                  })
                : null}
              {data && curCategory === "All" && data.products.length == 0 ? (
                <p>No result found</p>
              ) : null}
              {data &&
              curCategory != "All" &&
              data.getProductsByCategory.length > 0
                ? data.getProductsByCategory.map((product) => {
                    return (
                      <ProductCard key={product._id} productData={product} />
                    );
                  })
                : null}
              {data &&
              curCategory != "All" &&
              data.getProductsByCategory.length == 0 ? (
                <p>No result found</p>
              ) : null}
            </Grid>
          )}
        </div>
      </div>
    );
  }
}
