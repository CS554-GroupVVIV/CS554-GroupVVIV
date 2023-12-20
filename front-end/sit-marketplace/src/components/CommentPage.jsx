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

const CommentPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: currentUser.uid },
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="subtitle1">Rating: {rating}</Typography>
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
                            }\n${comment.comment}`}
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
