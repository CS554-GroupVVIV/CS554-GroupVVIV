import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { doSignInWithEmailAndPassword } from "../firebase/FirebaseFunction";
import ResetPassword from "./ResetPassword.tsx";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_USER, GET_USER } from "../queries.ts";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Login() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });
  const [emailInDOM, setEmailInDOM] = useState("");
  const [editUser] = useMutation(EDIT_USER);
  const defaultTheme = createTheme();

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

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://shorturl.at/jqtJM)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "white" }}>
                <LockOutlinedIcon style={{ color: "blue" }} />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleLogin}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      variant="body2"
                      onClick={() => {
                        navigate("/resetpassword");
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      variant="body2"
                      onClick={() => {
                        navigate("/signup");
                      }}
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default Login;
