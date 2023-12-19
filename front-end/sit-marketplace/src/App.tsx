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
import ProductDetailCard from "./components/ProductDetailCard.tsx";
import PostDetail from "./components/PostDetail.tsx";
import ProductForm from "./components/NewProduct.tsx";
import UserProfile from "./components/UserProfile.tsx";
import ResetPassword from "./components/ResetPassword.tsx";
import Error from "./components/Error.tsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LogoutButton from "./components/LogoutButton.tsx";

import ChatRoomList from "./components/ChatRoomList";
import { socketID, socket } from "./components/socket";

// redux and theme
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { darkMode, lightMode } from "./theme.ts";
import { toggleTheme } from "./redux/themeSlice.ts";
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
  Button,
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

  // ToggleSwitch component
  const ToggleSwitch = () => {
    return (
      <FormGroup sx={{ marginRight: 1, justifyContent: "center" }}>
        <FormControlLabel
          control={
            <Switch
              checked={theme.darkmode}
              onChange={() => {
                dispatch(toggleTheme());
              }}
              color="default"
            />
          }
          label={
            theme.darkmode ? (
              <DarkModeIcon fontSize="large" />
            ) : (
              <LightModeIcon fontSize="large" />
            )
          }
          labelPlacement="start"
        />
      </FormGroup>
    );
  };

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
          <Container maxWidth={"xl"}>
            <Toolbar disableGutters>
              <Typography
                variant="h5"
                noWrap
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
                    marginLeft: 5,
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
                    marginLeft: 5,
                  }}
                >
                  Posts
                </Link>
              </Typography>

              <Typography
                variant="inherit"
                noWrap
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
                          marginRight: 5,
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
                          marginRight: 5,
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
                          marginRight: 5,
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

                  <ToggleSwitch />
                </div>
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Dialog open={open} keepMounted onClose={handleClose}>
          <DialogTitle>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
              }}
            >
              Chat Rooms
            </Typography>
          </DialogTitle>
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

            <Route path="/error" element={<Error />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
