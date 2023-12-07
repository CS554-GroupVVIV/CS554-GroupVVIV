import React, { useContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home.tsx";
import Products from "./components/Products.tsx";
import Posts from "./components/Posts.tsx";
import Login from "./components/Login.tsx";
import SignUp from "./components/Signup.tsx";
import Chatbox from "./components/Chatbox.tsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import PostForm from "./components/PostForm.tsx";
import ProductDetail from "./components/ProductDetail.tsx";
import ProductForm from "./components/NewProduct.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
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
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/newpost" element={<PostForm />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/newproduct" element={<ProductForm />} />
          <Route
            path="/chat"
            element={user ? <Chatbox /> : <Navigate to={"/login"} />}
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
