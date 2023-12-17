import React, { useContext, useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

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
import PostDetail from "./components/PostDetail.tsx";
import ProductForm from "./components/NewProduct.tsx";
import UserProfile from "./components/UserProfile.tsx";
import ResetPassword from "./components/ResetPassword.tsx";
import Error from "./components/Error.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import ChatRoomListButton from "./components/ChatRoomListButton";

// redux and theme
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { darkMode, lightMode } from "./theme.ts";
import { toggleTheme } from "./redux/themeSlice.ts";

import {
  CssBaseline,
  AppBar,
  Container,
  Toolbar,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
  Link,
} from "@mui/material";

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // redux
  // get theme from store
  const theme = useSelector((state) => state.theme);
  console.log(theme.darkmode);

  // initialize dispatch variable
  const dispatch = useDispatch();

  // ToggleSwitch component
  const ToggleSwitch = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={theme.darkmode}
                onChange={() => {
                  dispatch(toggleTheme());
                }}
              />
            }
            label="Darkmode"
          />
        </FormGroup>
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme.darkmode ? darkMode : lightMode}>
      {/*  <ThemeProvider theme={darkMode}> */}
      <CssBaseline />
      <AuthProvider>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                }}
              >
                <Link
                  color="inherit"
                  component="button"
                  onClick={() => {
                    navigate("/");
                  }}
                  sx={{
                    textDecoration: "none",
                  }}
                >
                  Home
                </Link>
              </Typography>

              <Link
                color="inherit"
                component="button"
                onClick={() => {
                  navigate("/products");
                }}
                sx={{
                  marginLeft: 5,
                  textDecoration: "none",
                }}
              >
                Products
              </Link>

              <Link
                color="inherit"
                component="button"
                onClick={() => {
                  navigate("/posts");
                }}
                sx={{
                  marginLeft: 5,
                  textDecoration: "none",
                }}
              >
                Posts
              </Link>

              {/* <ChatRoomListButton /> */}

              <ToggleSwitch />
            </Toolbar>
          </Container>
        </AppBar>

        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/newpost" element={<PostForm />} />
            <Route path="/product/:id" element={<ProductDetail />} />
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
    </ThemeProvider>
  );
}

export default App;
