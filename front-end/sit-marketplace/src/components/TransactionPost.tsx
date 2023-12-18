// import React, { useContext } from "react";
// import { useQuery } from "@apollo/client";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext.jsx";
// import PostCard from "./PostCard.js";
// import { GET_POSTS_BY_BUYER, GET_POSTS_BY_SELLER } from "../queries.js";

// const TransactionPost = () => {
//   const { currentUser } = useContext(AuthContext);
//   const {
//     data: postSeller,
//     loading: postSellerLoading,
//     error: postSellerError,
//   } = useQuery(GET_POSTS_BY_SELLER, {
//     variables: { _id: currentUser.uid },
//   });
//   const navigate = useNavigate();
//   console.log("I sold: ", postSeller);

//   const {
//     data: postBuyer,
//     loading: postBuyerLoading,
//     error: postBuyerError,
//   } = useQuery(GET_POSTS_BY_BUYER, {
//     variables: { _id: currentUser.uid },
//   });
//   console.log("I bought: ", postBuyer);

//   // const PostCard = ({ post }) => {
//   //   return (
//   //     <div className="card w-96 bg-base-100 shadow-xl border-indigo-500/100">
//   //       <div
//   //         className="card-body hover:bg-blue-500 cursor-pointer"
//   //         onClick={() => {
//   //           navigate(`/post/${post._id}`);
//   //         }}
//   //       >
//   //         <p className="card-title">{post.item}</p>
//   //         <p>price: {post.price}</p>
//   //         <p>date: {post.date.split("T")[0]}</p>
//   //         <p>status: {post.status}</p>
//   //         <div className="card-actions justify-end">
//   //           {post.status == "completed" ? (
//   //             <button className="btn btn-primary">Comment</button>
//   //           ) : null}
//   //           {post.status == "inactive" ? (
//   //             <button className="btn btn-primary">Repost</button>
//   //           ) : null}
//   //           {post.status == "active" ? (
//   //             <button className="btn btn-primary">Retrive</button>
//   //           ) : null}
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   const postPurchased = () => {
//     if (postBuyer) {
//       return postBuyer.getPostByBuyer.map((post, index) => {
//         return <PostCard key={index} postData={post} />;
//       });
//     } else if (postBuyerLoading) {
//       return <p>Loading</p>;
//     } else if (postBuyerError) {
//       console.log(postBuyerError);
//       return <>Something went wrong</>;
//     }
//   };

//   const postSold = () => {
//     if (postSeller) {
//       return postSeller.getPostBySeller.map((post, index) => {
//         return <PostCard key={index} postData={post} />;
//       });
//     } else if (postSellerLoading) {
//       return <p>Loading</p>;
//     } else if (postSellerError) {
//       console.log(postSellerError);
//       return <>Something went wrong</>;
//     }
//   };

//   return (
//     <>
//       <div>
//         <h2>Items Purchased</h2>
//         {postPurchased()}
//       </div>
//       <div>
//         <h2>Items Sold</h2>
//         {postSold()}
//       </div>
//     </>
//   );
// };

// export default TransactionPost;
