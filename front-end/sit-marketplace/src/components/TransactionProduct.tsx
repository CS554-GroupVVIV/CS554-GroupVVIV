import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { GET_PRODUCTS_BY_BUYER, GET_PRODUCTS_BY_SELLER } from "../queries.js";
import ProductCard from "./ProductCard.js";

const TransactionProduct = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    data: productSeller,
    loading: productSellerLoading,
    error: productSellerError,
  } = useQuery(GET_PRODUCTS_BY_SELLER, {
    variables: { id: currentUser.uid },
  });
  const navigate = useNavigate();
  console.log("I sold these: ", productSeller);

  const {
    data: productBuyer,
    loading: productBuyerLoading,
    error: productBuyerError,
  } = useQuery(GET_PRODUCTS_BY_BUYER, {
    variables: { id: currentUser.uid },
  });
  console.log("I bought these: ", productBuyer);

  // const ProductCard = ({ product }) => {
  //   return (
  //     <div className="card w-96 bg-base-100 shadow-xl border-indigo-500/100" key={product._id}>
  //       <div
  //         className="card-body hover:bg-blue-500 cursor-pointer"
  //         onClick={() => {
  //           navigate(`/product/${product._id}`);
  //         }}
  //       >
  //         <p className="card-title">{product.name}</p>
  //         <p>price: {product.price}</p>
  //         <p>date: {product.date.split("T")[0]}</p>
  //         <p>status: {product.status}</p>
  //         <div className="card-actions justify-end">
  //           <button className="btn btn-primary">Comment</button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const productPurchased = () => {
    if (productBuyer) {
      return productBuyer.getProductByBuyer.map((product, index) => {
        return <ProductCard key={index} productData={product} />;
      });
    } else if (productBuyerLoading) {
      return <p>Loading</p>;
    } else if (productBuyerError) {
      console.log(productBuyerError);
      return <>Something went wrong</>;
    }
  };

  const productSold = () => {
    if (productSeller) {
      return productSeller.getProductBySeller.map((product, index) => {
        return <ProductCard key={index} productData={product} />;
      });
    } else if (productSellerLoading) {
      return <p>Loading</p>;
    } else if (productSellerError) {
      console.log(productSellerError);
      return <>Something went wrong</>;
    }
  };

  return (
    <>
      <div>
        <h2>Items Purchased</h2>
        {productPurchased()}
      </div>
      <div>
        <h2>Items Sold</h2>
        {productSold()}
      </div>
    </>
  );
};

export default TransactionProduct;
