import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunction";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_USER, GET_USER } from "../queries.ts";

function Login() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });
  const [emailInDOM, setEmailInDOM] = useState("");
  const [editUser] = useMutation(EDIT_USER);

  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;
    setEmailInDOM(email.value);

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(
        "Invalid email or password. Please check your credentials and try again."
      );
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert(
        "Please enter an email address below before you click the forgot password link"
      );
    }
  };

  // if (!loading && !error && currentUser) {
  //   useEffect(() => {
  //     if (
  //       data.getUserById &&
  //       currentUser.email === emailInDOM &&
  //       data.getUserById.email !== emailInDOM
  //     ) {
  //       editUser({
  //         variables: {
  //           id: currentUser.uid,
  //           email: currentUser.email,
  //           lastname: data.getUserById.lastname,
  //           firstname: data.getUserById.firstname,
  //         },
  //       });
  //       setEmailInDOM("");
  //     }
  //   }, [currentUser]);
  //   return <Navigate to="/" />;
  // }
  useEffect(() => {
    if (!loading && !error && currentUser) {
      if (
        data.getUserById &&
        currentUser.email === emailInDOM &&
        data.getUserById.email !== emailInDOM
      ) {
        editUser({
          variables: {
            id: currentUser.uid,
            email: currentUser.email,
            lastname: data.getUserById.lastname,
            firstname: data.getUserById.firstname,
          },
        });
        setEmailInDOM("");
      }
    }
  }, [loading, error, currentUser, data, emailInDOM, editUser]);

  if (!loading && !error && currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="card">
        <h1>Log-In</h1>
        <form className="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>
              Email Address:
              <br />
              <input
                name="email"
                id="email"
                type="email"
                placeholder="Email"
                required
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Password:
              <br />
              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="off"
                required
              />
            </label>
          </div>

          <button className="button" type="submit">
            Log In
          </button>

          <button className="forgotPassword" onClick={passwordReset}>
            Forgot Password
          </button>

          <button
            className="forgotPassword"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </button>
        </form>
        <br />
      </div>
    </div>
  );
}

export default Login;
