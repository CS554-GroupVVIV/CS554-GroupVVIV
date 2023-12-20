import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS_BY_ID } from "../queries";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { SEARCH_POST_BY_ID } from "../queries";
import PostCard from "./PostCard";

import { Link } from "@mui/material";

export default function FavoritePost({ favId }) {
  const { loading, error, data } = useQuery(SEARCH_POST_BY_ID, {
    variables: { id: favId },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error loading product</h1>;
  }

  return (
    <div>
      <PostCard postData={data.getPostById} />
    </div>
  );
}
