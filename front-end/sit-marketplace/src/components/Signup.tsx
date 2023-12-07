import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunction";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../queries";

function SignUp() {
  let { currentUser } = useContext(AuthContext);
  const [addUser] = useMutation(ADD_USER);

  const [pwMatch, setPwMatch] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    let { displayFirstName, displayLastName, email, passwordOne, passwordTwo } =
      e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    try {
      let user = await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayFirstName.value
      );
      console.log(user);

      addUser({
        variables: {
          _id: user.uid,
          email: user.email,
          lastname: displayLastName.value,
          firstname: displayFirstName.value,
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
      <h1>Sign up</h1>
      {pwMatch && <h4 className="error">{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
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

export default SignUp;
