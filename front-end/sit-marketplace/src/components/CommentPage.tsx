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
import { GET_USER } from "../queries.js";

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
    <p>Error</p>;
  } else if (data) {
    console.log(data);
    const comments = data.getUserById.comments;
    const rating = data.getUserById.rating;
    return (
      <Container maxWidth="lg">
        <Typography variant="subtitle1">
          Rating: {rating?.toFixed(2)} from {comments?.length} users
        </Typography>
        {comments && comments.length == 0 ? (
          <p>No Comments</p>
        ) : (
          <List sx={style} component="div" aria-label="comment">
            {comments &&
              comments.map((comment) => {
                return (
                  <>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {`${comment.rating.toFixed(2)} from ${
                              comment.comment_id
                            }\n"${comment.comment}"`}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </>
                );
              })}
          </List>
        )}
      </Container>
    );
  }
};

export default CommentPage;
