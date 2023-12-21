import React, { useState, useContext, useEffect } from "react";
import * as validation from "../helper";
import { AuthContext } from "../context/AuthContext.jsx";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "../queries";
import {
  doPasswordReset,
  updateUserProfile,
} from "../firebase/FirebaseFunction.jsx";
import { Button, Box, TextField, Stack } from "@mui/material";

function UserInfo({ data }) {
  let { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(data ? data.getUserById : {});
  const [firstname, setFirstname] = useState(
    data ? data.getUserById.firstname : ""
  );
  const [lastname, setLastname] = useState(
    data ? data.getUserById.lastname : ""
  );
  const [email, setEmail] = useState(data ? data.getUserById.email : "");
  const [password, setPassword] = useState("");
  const [editUser] = useMutation(EDIT_USER);

  const handleEdit = async (e) => {
    e.preventDefault();
    let { displayFirstName, displayLastName, email, password } =
      e.target.elements;
    try {
      displayFirstName = validation.checkFirstNameAndLastName(
        displayFirstName.value,
        "First Name"
      );
      displayLastName = validation.checkFirstNameAndLastName(
        displayLastName.value,
        "Last Name"
      );
      email = validation.checkEmail(email.value);
      password = password.value;

      editUser({
        variables: {
          id: currentUser.uid,
          email: data.getUserById.email,
          lastname: displayLastName,
          firstname: displayFirstName,
        },
      });
      await updateUserProfile(
        displayFirstName,
        currentUser.email,
        email,
        password
      );
    } catch (error) {
      alert(error);
      return false;
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    if (userInfo && currentUser) {
      doPasswordReset(userInfo.email);
      alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link"
      );
    }
  };

  return (
    // <div>
    //   <form onSubmit={handleEdit}>
    //     <div className="form-group">
    //       <label>
    //         First Name:
    //         <br />
    //         <input
    //           className="form-control"
    //           required
    //           name="displayFirstName"
    //           type="text"
    //           placeholder="First Name"
    //           value={firstname}
    //           onChange={(e) => setFirstname(e.target.value)}
    //         />
    //       </label>
    //     </div>
    //     <div className="form-group">
    //       <label>
    //         Last Name:
    //         <br />
    //         <input
    //           className="form-control"
    //           required
    //           name="displayLastName"
    //           type="text"
    //           placeholder="Last Name"
    //           value={lastname}
    //           onChange={(e) => setLastname(e.target.value)}
    //         />
    //       </label>
    //     </div>
    //     <div className="form-group">
    //       <label>
    //         Email:
    //         <br />
    //         <input
    //           disabled
    //           className="form-control"
    //           required
    //           name="email"
    //           type="email"
    //           placeholder="Email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //       </label>
    //     </div>
    //     <div className="form-group">
    //       <label>
    //         Verified Password:
    //         <br />
    //         <input
    //           className="form-control"
    //           required
    //           name="password"
    //           type="password"
    //           placeholder="Password"
    //           onChange={(e) => setPassword(e.target.value)}
    //         />
    //       </label>
    //     </div>
    //     <br />
    //     <button
    //       className="button"
    //       id="submitButton"
    //       name="submitButton"
    //       type="submit"
    //     >
    //       Update
    //     </button>

    //     <button className="forgotPassword" onClick={passwordReset}>
    //       Reset Password
    //     </button>
    //   </form>
    // </div>
    <Box component="form" noValidate onSubmit={handleEdit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="firstname"
        label="First Name"
        name="displayFirstName"
        value={firstname}
        autoFocus
        // inputProps={{ maxLength: 100 }}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="lastname"
        label="Last Name"
        name="displayLastName"
        value={lastname}
        // autoComplete="lastname"
        // inputProps={{ maxLength: 100 }}
        onChange={(e) => setLastname(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        disabled
        fullWidth
        id="email"
        label="Email"
        value={email}
        name="email"
        onChange={(e) => setEmail(e.target.value)}

        // autoComplete="email"
        // inputProps={{ maxLength: 100 }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        // autoComplete="password"
        onChange={(e) => setPassword(e.target.value)}
        // inputProps={{ maxLength: 100 }}
      />
      <Stack spacing={2} direction="row">
        <Button
          type="submit"
          fullWidth
          variant="contained"
          // sx={{ mt: 3, mb: 2 }}
        >
          Update
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          // sx={{ mt: 3, mb: 2 }}
        >
          Reset Password
        </Button>
      </Stack>
    </Box>
  );
}

export default UserInfo;
