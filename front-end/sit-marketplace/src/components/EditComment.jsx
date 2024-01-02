import React, { useEffect, useState, useContext, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { ADD_COMMENT, GET_USER, EDIT_COMMENT } from "../queries";

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

const EditComment = ({ record }) => {
  const { currentUser } = useContext(AuthContext);

  const [toggleEditComment, setToggleEditComment] = useState(false);

  const [prevComment, setPrevComment] = useState({});
  const [rating, setRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");

  const ratingRef = useRef();
  const commentInputRef = useRef();

  const [ratingError, setRatingError] = useState(false);
  const [commentInputError, setCommentInputError] = useState(false);

  const { data } = useQuery(GET_USER, {
    variables: { id: record._id },
    fetchPolicy: "cache-and-network",
  });

  if (record.comments[0].commenter._id !== currentUser.uid) {
    throw "You are not authorized to comment";
  }

  const helper = {
    checkRating: (newValue) => {
      setRatingError(false);
      let rating = newValue;
      if (!rating || rating < 1 || rating > 5) {
        setRatingError(true);
        return;
      }
      setRating(rating);
      return;
    },

    checkComment: () => {
      setCommentInputError(false);
      let commentInput = commentInputRef.current?.value;
      commentInput = commentInput.trim();
      if (commentInput.length > 100) {
        setCommentInputError(true);
        return;
      }
      setCommentInput(commentInput);
      return;
    },
  };

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

  const cancelEditComment = () => {
    setToggleEditComment(false);
  };

  const saveEditComment = () => {
    try {
      helper.checkRating(rating);
      helper.checkComment();

      editComment({
        variables: {
          user_id: record._id,
          comment_id: currentUser.uid,
          rating: rating,
          comment: commentInput,
        },
      });
    } catch (e) {
      alert(e);
    }
  };

  if (data)
    return (
      <>
        <Button
          size="small"
          variant="contained"
          // color="inherit"
          onClick={() => {
            setPrevComment(record.comments[0]);
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
              Update your transaction experience with{" "}
              {data.getUserById.firstname}
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
                      helper.checkRating(newValue);
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
                    inputProps={{ maxLength: 100 }}
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
      </>
    );
};

export default EditComment;
