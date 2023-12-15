import { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_POSTS,
  SEARCH_POST_BY_ID,
  RETRIEVE_POST,
  REPOST_POST,
} from "../queries";
import { ObjectId } from "mongodb";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";

export default function PostDetail() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_POSTS);
  const { data, loading, error } = useQuery(SEARCH_POST_BY_ID, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });

  const [retrievePost] = useMutation(RETRIEVE_POST, {
    onError: (e) => {
      alert(e);
    },
    onCompleted: () => {
      alert("Sucess");
    },
  });

  const [repostPost] = useMutation(REPOST_POST, {
    onError: (e) => {
      alert(e);
    },
    onCompleted: () => {
      alert("Sucess");
    },
  });

  const retrieve = (post) => {
    retrievePost({ variables: { id: post._id, user_id: currentUser.uid } });
  };

  const repost = (post) => {
    repostPost({ variables: { id: post._id, user_id: currentUser.uid } });
  };

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    return <h1>Error loading product</h1>;
  } else {
    const post = data.getPostById;
    console.log(currentUser, post.buyer_id);
    return (
      <div className="card w-96 bg-base-100 shadow-xl border-indigo-500/100">
        <div className="card-body">
          <p className="card-title">Detail of Post</p>
          <p>Item: {post.item}</p>
          <p>Buyer Id: {post.buyer_id}</p>
          <p>Seller Id: {post.seller_id}</p>
          <p>Category: {post.category}</p>
          <p>Price: {post.price}</p>
          <p>Transaction Date: {post.date.split("T")[0]}</p>
          <p>Status: {post.status}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Comment</button>
            {post.buyer_id == currentUser.uid && post.status == "active" ? (
              <button
                onClick={() => {
                  retrieve(post);
                }}
              >
                Retrieve Post
              </button>
            ) : null}

            {post.buyer_id == currentUser.uid && post.status == "inactive" ? (
              <button
                onClick={() => {
                  repost(post);
                }}
              >
                Repost
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
