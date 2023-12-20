import React, { useState, useContext, useEffect } from "react";
import * as validation from "../helper";
import { AuthContext } from "../context/AuthContext.jsx";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "../queries";
import {
  doPasswordReset,
  updateUserProfile,
} from "../firebase/FirebaseFunction.jsx";

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
    <div>
      <form onSubmit={handleEdit}>
        <div className="form-group">
          <label>
            First Name:
            <br />
            <input
              className="form-control"
              required
              name="displayFirstName"
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Last Name:
            <br />
            <input
              className="form-control"
              required
              name="displayLastName"
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <br />
            <input
              disabled
              className="form-control"
              required
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Verified Password:
            <br />
            <input
              className="form-control"
              required
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <br />
        <button
          className="button"
          id="submitButton"
          name="submitButton"
          type="submit"
        >
          Update
        </button>

        <button className="forgotPassword" onClick={passwordReset}>
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default UserInfo;
