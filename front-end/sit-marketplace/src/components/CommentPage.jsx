import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

import {
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries";

const style = {
  width: "100%",
  bgcolor: "background.paper",
};

const CommentPage = ({ user_id }) => {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: user_id },
  });

  if (loading) {
    return <p>Loading</p>;
  } else if (error) {
    return <p>Something went wrong</p>;
  } else if (data) {
    const comments = data.getUserById.comments;
    const rating = data.getUserById.rating;
    return (
      <Container maxWidth="lg">
        <Typography variant="subtitle1">
          Rating: {rating?.toFixed(2)} from {comments?.length} users
        </Typography>
        {comments && comments.length == 0 ? (
          <p>No Comment</p>
        ) : (
          <List sx={style} component="div" aria-label="comment">
            {comments &&
              comments.map((comment, index) => {
                return (
                  <div key={comment._id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {`${comment.rating.toFixed(2)} from ${
                              comment.commenter.firstname
                            } on ${
                              /^\d+$/.test(comment.date)
                                ? new Date(
                                    parseInt(comment.date)
                                  ).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                : new Date(comment.date).toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
                                  )
                            }
                            `}
                            {comment.comment != ""
                              ? `\n"${comment.comment}"`
                              : null}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index != comments.length - 1 && <Divider />}
                  </div>
                );
              })}
          </List>
        )}
      </Container>
    );
  }
};

export default CommentPage;
