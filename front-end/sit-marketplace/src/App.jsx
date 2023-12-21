import React, { useContext, useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Home from "./components/Home.jsx";
import Products from "./components/Products.jsx";
import Posts from "./components/Posts.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/Signup.jsx";
import SearchProduct from "./components/SearchProduct.jsx";
import ChatRooms from "./components/ChatRoomList.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import PostForm from "./components/PostForm.jsx";
import ProductDetailCard from "./components/ProductDetailCard.jsx";
import PostDetail from "./components/PostDetail.jsx";
import ProductForm from "./components/NewProduct.jsx";
import UserProfile from "./components/UserProfile.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import Error from "./components/Error.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LogoutButton from "./components/LogoutButton.jsx";

import ChatRoomList from "./components/ChatRoomList.jsx";
import { socketID, socket } from "./components/socket.jsx";

// redux and theme
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { darkMode, lightMode } from "./theme.js";
import { toggleTheme } from "./redux/themeSlice.js";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  IconButton,
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

  // initialize dispatch variable
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    socket.on("join room", () => {
      setOpen(true);
    });
  }, [socket]);

  return (
    <ThemeProvider theme={theme.darkmode ? darkMode : lightMode}>
      {/*  <ThemeProvider theme={darkMode}> */}
      <CssBaseline />
      <AuthProvider>
        <AppBar position="fixed">
          <Container maxWidth={"xxl"}>
            <Toolbar disableGutters>
              <Typography
                variant="h5"
                // noWrap
                sx={{
                  fontWeight: "bold",
                  flexGrow: 1,
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
                    padding: 2,
                  }}
                >
                  Home
                </Link>

                <Link
                  color="inherit"
                  component="button"
                  onClick={() => {
                    navigate("/products");
                  }}
                  sx={{
                    textDecoration: "none",
                    padding: 2,
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
                    textDecoration: "none",
                    padding: 2,
                  }}
                >
                  Posts
                </Link>
              </Typography>

              <Typography
                variant="subtitle1"
                // noWrap
                sx={{
                  fontWeight: "bold",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {user ? (
                    <>
                      <Link
                        color="inherit"
                        component="button"
                        onClick={() => {
                          navigate("/userprofile");
                        }}
                        sx={{
                          textDecoration: "none",
                          padding: 2,
                        }}
                      >
                        User Profile
                      </Link>

                      <Link
                        color="inherit"
                        component="button"
                        onClick={handleClickOpen}
                        sx={{
                          textDecoration: "none",
                          padding: 2,
                        }}
                      >
                        Chat Rooms
                      </Link>

                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <Link
                        color="inherit"
                        component="button"
                        onClick={() => {
                          navigate("/login");
                        }}
                        sx={{
                          textDecoration: "none",
                          padding: 2,
                        }}
                      >
                        Login
                      </Link>

                      {/* <Link
                        color="inherit"
                        component="button"
                        onClick={() => {
                          navigate("/signup");
                        }}
                        sx={{
                          textDecoration: "none",
                          marginRight: 5,
                        }}
                      >
                        Signup
                      </Link> */}
                    </>
                  )}

                  <IconButton
                    color="inherit"
                    size="large"
                    onClick={() => {
                      dispatch(toggleTheme());
                    }}
                  >
                    {theme.darkmode ? <DarkModeIcon /> : <LightModeIcon />}
                  </IconButton>
                </div>
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Dialog open={open} keepMounted onClose={handleClose}>
          <DialogTitle>
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Chat Rooms
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <ChatRoomList uid={user && user.uid} />
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>

        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/posts" element={<Posts />} />
            <Route
              path="/login"
              element={user ? <Navigate to={"/"} /> : <Login />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to={"/"} /> : <SignUp />}
            />
            <Route
              path="/resetpassword"
              element={user ? <Navigate to={"/login"} /> : <ResetPassword />}
            />

            <Route
              path="/newproduct"
              element={user ? <ProductForm /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/newpost"
              element={user ? <PostForm /> : <Navigate to={"/login"} />}
            />
            <Route path="/product/:id" element={<ProductDetailCard />} />
            <Route path="/post/:id" element={<PostDetail />} />

            <Route
              path="/userprofile"
              element={user ? <UserProfile /> : <Navigate to={"/login"} />}
            />
            <Route
              path="*"
              element={<Error messageProp="Bad Input" statusCodeProp={400} />}
            />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
