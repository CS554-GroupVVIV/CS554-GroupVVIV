import React, { useState, useContext, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { ADD_COMMENT, GET_COMMENT, GET_USER } from "../queries";

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

const NewComment = ({ user_id }) => {
  const { currentUser } = useContext(AuthContext);

  const [toggleNewComment, setToggleNewComment] = useState(false);
  const [rating, setRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");

  // const ratingRef = useRef();
  // const commentInputRef = useRef();

  const [ratingError, setRatingError] = useState(false);
  const [commentInputError, setCommentInputError] = useState(false);

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: user_id },
    fetchPolicy: "cache-and-network",
  });

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

    checkComment: (value) => {
      setCommentInputError(false);
      value = value.trim();
      if (value.length > 100) {
        setCommentInputError(true);
        return;
      }
      setCommentInput(value);
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
    refetchQueries: [
      {
        query: GET_COMMENT,
        variables: { user_id: user_id, comment_id: currentUser.uid },
      },
    ],
  });

  const cancelNewComment = () => {
    setRating(0);
    setToggleNewComment(false);
  };

  const saveNewComment = () => {
    try {
      helper.checkRating(rating);
      // helper.checkComment();
      addComment({
        variables: {
          user_id: user_id,
          comment_id: currentUser.uid,
          firstname: currentUser.displayName,
          rating: rating,
          comment: commentInput,
        },
      });
    } catch (e) {
      alert(e);
    }
  };
  if (loading) {
    return <p>loading</p>;
  } else if (error) {
    return <p>Error</p>;
  } else if (data)
    return (
      <>
        <Button
          size="small"
          variant="contained"
          // color="inherit"
          onClick={() => {
            setToggleNewComment(true);
          }}
          // style={{ marginTop: 100 }}
        >
          Comment
        </Button>

        <Dialog open={toggleNewComment} maxWidth="md">
          <DialogTitle>Comment</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              How was your transaction experience with{" "}
              {data.getUserById.firstname}?
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
                    onChange={(e) => {
                      helper.checkComment(e.target.value);
                    }}
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
                onClick={() => {
                  cancelNewComment();
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

export default NewComment;
