import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CommentPage from "./CommentPage";

const RatingProfile = ({ id }) => {
  const [toggle, setToggle] = useState(false);
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: id },
    fetchPolicy: "cache-and-network",
  });

  if (data) {
    return (
      <>
        <Button
          size="small"
          variant="contained"
          // color="inherit"
          onClick={() => {
            setToggle(true);
          }}
        >
          Rating Profile
        </Button>

        <Dialog open={toggle} maxWidth="sm" fullWidth={true}>
          <DialogTitle>
            {data.getUserById.firstname}'s Rating Profile
          </DialogTitle>
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
