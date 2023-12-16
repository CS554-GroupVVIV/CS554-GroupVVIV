import React, { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_USER, GET_USER, GET_PRODUCTS_BY_IDS } from "../queries.ts";
import {
  doPasswordReset,
  updateUserProfile,
} from "../firebase/FirebaseFunction";
import TransactionPost from "./TransactionPost.tsx";
import TransactionProduct from "./TransactionProduct.tsx";
import * as validation from "../helper.tsx";
import { useApolloClient } from "@apollo/client";
import { FetchPolicy } from "@apollo/client";
import { Link } from "react-router-dom";

function UserProfile() {
  let { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });
  const [userInfo, setUserInfo] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favorite, setFavorite] = useState([]);
  const baseUrl = "http://localhost:5173/product/";

  const [togglePost, setTogglePost] = useState<boolean>(false);
  const [toogleProduct, setToggleProduct] = useState<boolean>(false);
  const [editUser] = useMutation(EDIT_USER);

  useEffect(() => {
    console.log("in the effect");
    console.log(data);

    if (!loading && !error && data && data.getUserById) {
      setUserInfo(data.getUserById);
      setFirstname(data.getUserById.firstname);
      setLastname(data.getUserById.lastname);
      setEmail(data.getUserById.email);
      setFavorite(data.getUserById.favorite || []);

      client
        .query({
          query: GET_PRODUCTS_BY_IDS,
          variables: { ids: data.getUserById.favorite },
          fetchPolicy: "cache-and-network" as FetchPolicy,
        })
        .then((result) => {
          console.log(result.data);
          setFavorite(result.data.getProductsByIds);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loading, error, data]);

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
      // email = email.value; (cancel to use stevens' email address)

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
              value={password}
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
      <br />
      <button
        onClick={() => {
          setTogglePost(!togglePost);
        }}
      >
        Transaction from Post
      </button>

      {togglePost ? <TransactionPost /> : null}
      <button
        onClick={() => {
          setToggleProduct(!toogleProduct);
        }}
      >
        Transaction from Product
      </button>
      {toogleProduct ? <TransactionProduct /> : null}

      <div className="favorite-products-list">
        My Favorite Products
        {favorite &&
          favorite.map((fav) => (
            <Link to={baseUrl + fav._id}>
              {fav.name}
              <br />
              {fav.price}
            </Link>
          ))}
      </div>
    </div>
  );
}

export default UserProfile;
