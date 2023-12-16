import React, { useEffect, useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { ADD_COMMENT, GET_COMMENT, EDIT_COMMENT } from "../queries";
import { checkRating } from "../helper.js";
import { common } from "@mui/material/colors";
import { set } from "firebase/database";

const Comment = ({ data }) => {
  const { currentUser } = useContext(AuthContext);

  const [toggleNewComment, setToggleNewComment] = useState<boolean>(false);
  const [toggleEditComment, setToggleEditComment] = useState<boolean>(false);

  const [rating, setRating] = useState<number>(0);
  const [prevComment, setPrevComment] = useState({});

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
  const [addComment] = useMutation(ADD_COMMENT, {
    onError: (e) => {
      alert(e);
      cancelNewComment();
    },
    onCompleted: () => {
      alert("Success");
      setToggleNewComment(false);
    },
  });

  const [editComment] = useMutation(EDIT_COMMENT, {
    onError: (e) => {
      alert(e);
      cancelEditComment();
    },
    onCompleted: () => {
      alert("Success");
      setToggleEditComment(false);
    },
  });

  useEffect(() => {
    if (toggleNewComment) {
      document.getElementById("commentForm").showModal();
    } else {
      if (document.getElementById("commentForm"))
        document.getElementById("commentForm").close();
    }
  }, [toggleNewComment, rating]);

  const cancelNewComment = () => {
    setToggleNewComment(false);
    document.getElementById("comment-form").reset();
    setRating(0);
  };
  const saveNewComment = () => {
    try {
      let comment = "";
      if (
        document.getElementById("newComment").value &&
        document.getElementById("newComment").value.trim() != ""
      ) {
        comment = document.getElementById("newComment").value.trim();
        if (comment.length > 100) {
          throw "Maximum length of comment is 100 letters ";
        }
      }
      addComment({
        variables: {
          user_id: user_id,
          comment_id: currentUser.uid,
          rating: rating,
          comment: comment,
        },
      });
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    if (toggleEditComment) {
      document.getElementById("editForm").showModal();
    } else {
      if (document.getElementById("editForm")) {
        document.getElementById("editForm").close();
      }
    }
  }, [toggleEditComment, rating]);

  const cancelEditComment = () => {
    setToggleEditComment(false);
    document.getElementById("edit-form").reset();
    setRating(comment.getComment.comments[0].rating);
  };
  const saveEditComment = () => {
    try {
      let comment = "";
      if (
        document.getElementById("editComment").value &&
        document.getElementById("editComment").value.trim() != ""
      ) {
        comment = document.getElementById("editComment").value.trim();
        if (comment.length > 100) {
          throw "Maximum length of comment is 100 letters ";
        }
        if (rating == prevComment.rating && comment == prevComment.comment) {
          throw "No Change Made";
        }
      }
      editComment({
        variables: {
          user_id: user_id,
          comment_id: currentUser.uid,
          rating: rating,
          comment: comment,
        },
      });
    } catch (e) {
      alert(e);
    }
  };

  const EditComment = ({ record }) => {
    console.log(record);
    return (
      <>
        <button
          onClick={() => {
            setPrevComment(record);
            setRating(record.rating);
            setToggleEditComment(true);
          }}
        >
          Comment
        </button>
        <dialog id="editForm" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Comment</h3>
            <p>Update your transaction experience with {user_id}</p>
            <form id="edit-form">
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="rating">
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={1}
                        onChange={() => {
                          setRating(1);
                        }}
                        checked={rating > 0}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={2}
                        onChange={() => {
                          setRating(2);
                        }}
                        checked={rating > 1}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={3}
                        onChange={() => {
                          setRating(3);
                        }}
                        checked={rating > 2}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={4}
                        onChange={() => {
                          setRating(4);
                        }}
                        checked={rating > 3}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={5}
                        onChange={() => {
                          setRating(5);
                        }}
                        checked={rating > 4}
                        className="mask mask-star-2 bg-orange-400"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="edit-first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Leave your comment:
                      </label>
                      <div className="mt-2">
                        <input
                          type="textarea"
                          name="editComment"
                          id="editComment"
                          defaultValue={record.comment}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="float-right mt-3">
              <button
                onClick={cancelEditComment}
                className="text-sm font-semibold leading-6 text-gray-900 mr-6"
              >
                Close
              </button>
              <button
                onClick={saveEditComment}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </div>
        </dialog>
      </>
    );
  };

  const NewComment = () => {
    return (
      <>
        <button
          onClick={() => {
            setToggleNewComment(!toggleNewComment);
          }}
        >
          Comment
        </button>
        <dialog id="commentForm" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Comment</h3>
            <p>How was your transaction experience with {user_id}?</p>
            <form id="comment-form">
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="rating">
                      <label
                        htmlFor="edit-first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Rating:
                      </label>
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={1}
                        onChange={() => {
                          setRating(1);
                        }}
                        checked={rating > 0}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={2}
                        onChange={() => {
                          setRating(2);
                        }}
                        checked={rating > 1}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={3}
                        onChange={() => {
                          setRating(3);
                        }}
                        checked={rating > 2}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={4}
                        onChange={() => {
                          setRating(4);
                        }}
                        checked={rating > 3}
                        className="mask mask-star-2 bg-orange-400"
                      />
                      <input
                        type="checkbox"
                        name="rating-2"
                        value={5}
                        onChange={() => {
                          setRating(5);
                        }}
                        checked={rating > 4}
                        className="mask mask-star-2 bg-orange-400"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="edit-first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Leave your comment:
                      </label>
                      <div className="mt-2">
                        <input
                          type="textarea"
                          name="newComment"
                          id="newComment"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="float-right mt-3">
              <button
                onClick={cancelNewComment}
                className="text-sm font-semibold leading-6 text-gray-900 mr-6"
              >
                Close
              </button>
              <button
                onClick={saveNewComment}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </div>
        </dialog>
      </>
    );
  };

  if (commentLoading) {
    return <p>Loading</p>;
  } else if (commentError) {
    return <p>Something went wrong</p>;
  } else if (comment && comment.getComment) {
    const record = comment.getComment.comments[0];
    return <EditComment record={record} />;
  } else {
    return <NewComment />;
  }
};

export default Comment;
