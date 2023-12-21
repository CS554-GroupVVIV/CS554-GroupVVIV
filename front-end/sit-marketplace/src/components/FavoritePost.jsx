import { useQuery } from "@apollo/client";
import { SEARCH_POST_BY_ID } from "../queries";
import PostCard from "./PostCard";

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
