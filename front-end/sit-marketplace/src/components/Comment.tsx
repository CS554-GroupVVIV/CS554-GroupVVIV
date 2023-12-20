import { useContext } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { GET_COMMENT } from "../queries";

import EditComment from "./EditComment.js";
import NewComment from "./NewComment.js";

const Comment = ({ data }) => {
  const { currentUser } = useContext(AuthContext);

  let user_id = undefined;
  if (data.seller_id === currentUser.uid) {
    user_id = data.buyer_id;
  } else if (data.buyer_id === currentUser.uid) {
    user_id = data.seller_id;
  } else {
    throw "You are not authorized to comment";
  }

  const {
    data: comment,
    loading: commentLoading,
    error: commentError,
  } = useQuery(GET_COMMENT, {
    variables: { user_id: user_id, comment_id: currentUser.uid },
  });

  if (commentLoading) {
    return <p>Loading</p>;
  } else if (commentError) {
    return <p>Something went wrong</p>;
  } else if (comment && comment.getComment) {
    const record = comment.getComment;
    return <EditComment record={record} />;
  } else {
    return <NewComment user_id={user_id} />;
  }
};

export default Comment;
