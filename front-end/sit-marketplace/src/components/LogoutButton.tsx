import React from "react";
import { doSignOut } from "../firebase/FirebaseFunction";

const LogoutButton = () => {
  return (
    <button className="button" type="button" onClick={doSignOut}>
      Log Out
    </button>
  );
};

export default LogoutButton;
