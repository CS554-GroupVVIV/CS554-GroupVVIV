import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home.tsx";
import Products from "./components/Products.tsx";
import Posts from "./components/Posts.tsx";
import Login from "./components/Login.tsx";
import SignUp from "./components/Signup.tsx";
import { AuthProvider } from "./context/AuthContext";
import PostForm from "./components/PostForm.tsx";
import ProductForm from "./components/NewProduct.tsx";

function App() {
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
          <Route path="/newproduct" element={<ProductForm />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
