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
        marginLeft: 5,
        textDecoration: "none",
      }}
    >
      Log Out
    </Link>
  );
};

export default LogoutButton;
