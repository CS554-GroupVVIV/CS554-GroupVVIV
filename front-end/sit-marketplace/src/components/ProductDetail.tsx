import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
import { ObjectId } from "mongodb";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null); // Changed to null for initial state
  const navigate = useNavigate();
  let { id } = useParams();
  const { error, data } = useQuery(SEARCH_PRODUCTS_BY_ID, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    console.log(data);
    if (!error && data && data.getProductById) {
      setProduct(data.getProductById);
      console.log(product);
      setLoading(false);
    }
  }, [data, error]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error loading product</h1>;
  }

  return (
    <div>
      {product && <ProductCard productData={product} />}{" "}
      {/* Check for product existence */}
    </div>
  );
}
