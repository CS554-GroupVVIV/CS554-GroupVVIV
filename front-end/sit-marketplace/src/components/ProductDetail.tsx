import { useEffect, useState, useContext } from "react";
import ProductCard from "./ProductCard";
import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null); // Changed to null for initial state
  const { _id, email, firstname, lastname } = currentUser;
  const navigate = useNavigate();
  const { id } = useParams();

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
    } else if (error) {
      console.error(error);
    }
  }, [data, error]);

  // function handleFavorite() {
  //   //get user id for current session
  //   //mutate the favorite by current user id
  // }

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
