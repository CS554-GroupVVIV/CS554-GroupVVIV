import React, { useEffect, useState, useContext, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { ADD_COMMENT, GET_COMMENT, EDIT_COMMENT } from "../queries";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  TextField,
  Grid,
  Box,
  Stack,
  Rating,
} from "@mui/material";

const Comment = ({ data }) => {
  const { currentUser } = useContext(AuthContext);

  const [toggleNewComment, setToggleNewComment] = useState<boolean>(false);
  const [toggleEditComment, setToggleEditComment] = useState<boolean>(false);

  const [prevComment, setPrevComment] = useState({});
  const [rating, setRating] = useState<number>(0);
  const [commentInput, setCommentInput] = useState("");

  const ratingRef = useRef();
  const commentInputRef = useRef();

  const [ratingError, setRatingError] = useState<boolean>(false);
  const [commentInputError, setCommentInputError] = useState<boolean>(false);

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

  const helper = {
    checkRating(newValue): void {
      console.log(newValue);
      setRatingError(false);
      let rating: number | undefined = newValue;
      if (!rating || rating < 1 || rating > 5) {
        setRatingError(true);
        return;
      }
      setRating(rating);
      // console.log(rating);
      return;
    },

    checkComment(): void {
      setCommentInputError(false);
      let commentInput: string | undefined = commentInputRef.current?.value;
      if (!commentInput || commentInput.trim() == "") {
        setCommentInputError(true);
        return;
      }
      commentInput = commentInput.trim();
      if (commentInput.length < 0 || commentInput.length > 100) {
        setCommentInputError(true);
        return;
      }
      setCommentInput(commentInput);
      return;
    },
  };

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

  const cancelNewComment = () => {
    setToggleNewComment(false);
    setRating(0);
  };

  const saveNewComment = () => {
    try {
      helper.checkRating(rating);
      helper.checkComment();
      addComment({
        variables: {
          user_id: user_id,
          comment_id: currentUser.uid,
          rating: rating,
          comment: commentInput,
        },
      });
    } catch (e) {
      alert(e);
    }
  };

  const cancelEditComment = () => {
    console.log(prevComment);
    setToggleEditComment(false);
    // setRating(prevComment.rating);
  };

  const saveEditComment = () => {
    try {
      helper.checkRating(rating);
      helper.checkComment();

      editComment({
        variables: {
          user_id: user_id,
          comment_id: currentUser.uid,
          rating: rating,
          comment: commentInput,
        },
      });
    } catch (e) {
      alert(e);
    }
  };

  const EditComment = ({ record }) => {
    return (
      <>
        <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={() => {
            setPrevComment(record);
            setRating(record.rating);
            setToggleEditComment(true);
          }}
        >
          Comment
        </Button>

        <Dialog open={toggleEditComment} maxWidth="md">
          <DialogTitle>Comment</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Update your transaction experience with {user_id}
            </DialogContentText>
            <Box
              component="form"
              noValidate
              sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    name="simple-controlled"
                    ref={ratingRef}
                    defaultValue={prevComment.rating}
                    onChange={(event, newValue) => {
                      // helper.checkRating(newValue);
                      setRating(newValue);
                    }}
                  />
                  {ratingError && (
                    <Typography
                      component="span"
                      variant="body2"
                      style={{ color: "red" }}
                    >
                      * Please give ratings in range 1~5
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="comment"
                    label="Comment"
                    name="comment"
                    inputRef={commentInputRef}
                    defaultValue={prevComment.comment}
                    onBlur={helper.checkComment}
                  />
                  {commentInputError && (
                    <Typography
                      component="span"
                      variant="body2"
                      style={{ color: "red" }}
                    >
                      * Comment should have 100 letters at most
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={cancelEditComment}
              >
                Cancel
              </Button>
              <Button
                onClick={saveEditComment}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
        {/* <dialog id="editForm" className="modal">
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
        </dialog> */}
      </>
    );
  };

  const NewComment = () => {
    return (
      <>
        <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={() => {
            setToggleNewComment(true);
          }}
        >
          Comment
        </Button>

        <Dialog open={toggleNewComment} maxWidth="md">
          <DialogTitle>Comment</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              How was your transaction experience with {user_id}?
            </DialogContentText>
            <Box
              component="form"
              noValidate
              sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography component="legend">Rating</Typography>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    ref={ratingRef}
                    onChange={(event, newValue) => {
                      // event.preventDefault();
                      setRating(newValue);
                      // helper.checkRating(newValue);
                    }}
                  />
                  {ratingError && (
                    <Typography
                      component="span"
                      variant="body2"
                      style={{ color: "red" }}
                    >
                      * Please give ratings in range 1~5
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="comment"
                    label="Comment"
                    name="comment"
                    inputRef={commentInputRef}
                    onBlur={helper.checkComment}
                  />
                  {commentInputError && (
                    <Typography
                      component="span"
                      variant="body2"
                      style={{ color: "red" }}
                    >
                      * Comment should have 100 letters at most
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  setToggleNewComment(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={saveNewComment}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
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
