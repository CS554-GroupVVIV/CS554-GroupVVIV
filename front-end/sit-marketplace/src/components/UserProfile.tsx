import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_USER, GET_USER } from "../queries.ts";
import * as validation from "../helper.tsx";

function UserProfile() {
  let { currentUser } = useContext(AuthContext);
  const [getUser] = useQuery(GET_USER);
  const [editUser] = useMutation(EDIT_USER);

  const [userInfo, setUserInfo] = useState(getUser(currentUser.uid));
  const [pwMatch, setPwMatch] = useState("");
  const [firstname, setFirstName] = useState(userInfo.firstname);
  const [lastname, setLastName] = useState(userInfo.lastname);

  const handleEdit = async (e) => {
    e.preventDefault();
    let { displayFirstName, displayLastName, email, passwordOne, passwordTwo } =
      e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

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
    } catch (error) {
      alert(error);
      return false;
    }

    try {
      let user = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne.value,
        displayFirstName
      );
      console.log(user);

      addUser({
        variables: {
          _id: user.uid,
          email: user.email,
          lastname: displayLastName,
          firstname: displayFirstName,
        },
      });
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="card">
      <h1>User Profile</h1>
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
              autoFocus={true}
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
              autoFocus={true}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <br />
            <input
              className="form-control"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <br />
            <input
              className="form-control"
              id="passwordOne"
              name="passwordOne"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Confirm Password:
            <br />
            <input
              className="form-control"
              name="passwordTwo"
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        {pwMatch && <h4 className="error">{pwMatch}</h4>}
        <button
          className="button"
          id="submitButton"
          name="submitButton"
          type="submit"
        >
          Sign Up
        </button>
      </form>
      <br />
    </div>
  );
}

export default UserProfile;
