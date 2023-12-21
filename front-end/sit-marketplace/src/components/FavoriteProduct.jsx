import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "./ProductCard";

import { Link } from "@mui/material";

export default function FavoriteProduct({ favId }) {
  const { loading, error, data } = useQuery(SEARCH_PRODUCTS_BY_ID, {
    variables: { id: favId },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error loading product</h1>;
  }
  console.log(data);
  return (
    <div>
      <ProductCard productData={data.getProductById} />
    </div>
  );
}
