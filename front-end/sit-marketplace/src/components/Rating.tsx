import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CommentPage from "./CommentPage";

const RatingProfile = ({ id }) => {
  const [toggle, setToggle] = useState(false);
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <p>Loading</p>;
  } else if (error) {
    <p>Error</p>;
  } else if (data) {
    return (
      <>
        <Button
          size="small"
          variant="contained"
          color="inherit"
          onClick={() => {
            setToggle(true);
          }}
        >
          Rating Profile
        </Button>

        <Dialog open={toggle} maxWidth="md">
          <DialogTitle>User Profile</DialogTitle>
          <DialogContent style={{ overflow: "auto" }}>
            <CommentPage user_id={id} />
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => setToggle(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
};

export default RatingProfile;
