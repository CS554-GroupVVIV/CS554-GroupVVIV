import React from "react";
import { Link } from "@mui/material";
import { doSignOut } from "../firebase/FirebaseFunction";

const LogoutButton = () => {
  return (
    <Link
      color="inherit"
      component="button"
      onClick={doSignOut}
      sx={{
        textDecoration: "none",
        padding: 2,
      }}
    >
      Log Out
    </Link>
  );
};

export default LogoutButton;
