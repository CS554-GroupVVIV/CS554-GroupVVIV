import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { GET_POSTS_BY_BUYER, GET_POSTS_BY_SELLER } from "../queries.js";

const TransactionPost = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    data: postSeller,
    loading: postSellerLoading,
    error: postSellerError,
  } = useQuery(GET_POSTS_BY_SELLER, {
    variables: { _id: currentUser.uid },
  });
  console.log("I sold: ", postSeller);

  const {
    data: postBuyer,
    loading: postBuyerLoading,
    error: postBuyerError,
  } = useQuery(GET_POSTS_BY_BUYER, {
    variables: { _id: currentUser.uid },
  });
  console.log("I bought: ", postBuyer);

  const PostCard = ({ post }) => {
    return (
      <div className="card w-96 bg-base-100 shadow-xl border-indigo-500/100">
        <div className="card-body">
          <p className="card-title">{post.item}</p>
          <p>price: {post.price}</p>
          <p>date: {post.date.split("T")[0]}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Comment</button>
          </div>
        </div>
      </div>
    );
  };

  const postPurchased = () => {
    if (postBuyer) {
      return postBuyer.getPostByBuyer.map((post) => {
        return <PostCard post={post} />;
      });
    } else if (postBuyerLoading) {
      return <p>Loading</p>;
    } else if (postBuyerError) {
      return <>{postBuyerError}</>;
    }
  };

  const postSold = () => {
    if (postSeller) {
      return postSeller.getPostBySeller.map((post) => {
        return <PostCard post={post} />;
      });
    } else if (postSellerLoading) {
      return <p>Loading</p>;
    } else if (postSellerError) {
      return <>{postSellerError}</>;
    }
  };

  return (
    <>
      <div>
        <h2>Items Purchased</h2>
        {postPurchased()}
      </div>
      <div>
        <h2>Items Sold</h2>
        {postSold()}
      </div>
    </>
  );
};

export default TransactionPost;
