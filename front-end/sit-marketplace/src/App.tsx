import React, { useContext, useState } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import Home from "./components/Home.tsx";
import Products from "./components/Products.tsx";
import Posts from "./components/Posts.tsx";
import Login from "./components/Login.tsx";
import SignUp from "./components/Signup.tsx";
import SearchProduct from "./components/SearchProduct.tsx";
import ChatRooms from "./components/ChatRoomList.tsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import PostForm from "./components/PostForm.tsx";
import ProductDetail from "./components/ProductDetail.tsx";
import ProductDetailCard from "./components/ProductDetailCard.tsx";
import PostDetail from "./components/PostDetail.tsx";
import ProductForm from "./components/NewProduct.tsx";
import UserProfile from "./components/UserProfile.tsx";
import ResetPassword from "./components/ResetPassword.tsx";
import Error from "./components/Error.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      const uid = user.uid;
      setUser(user);
    } else {
      setUser(null);
    }
  });

  return (
    <AuthProvider>
      <header></header>
      <nav className="App-nav">
        <ul>
          <li>
            <Link className="singlelink" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="singlelink" to="/products">
              All the Products
            </Link>
          </li>
          <li>
            <Link className="singlelink" to="/posts">
              All the Posts
            </Link>
          </li>
        </ul>
      </nav>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/newpost" element={<PostForm />} />
          <Route path="/product/:id" element={<ProductDetailCard />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/newproduct" element={<ProductForm />} />
          <Route path="/error" element={<Error />} />
          <Route
            path="/userprofile"
            element={user ? <UserProfile /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/resetpassword"
            element={user ? <Home /> : <ResetPassword />}
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
