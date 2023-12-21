import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunction";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../queries";
import * as validation from "../helper";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Grid,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function SignUp() {
  let { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [addUser] = useMutation(ADD_USER);
  const defaultTheme = createTheme();
  const [pwMatch, setPwMatch] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    let { firstname, lastname, email, passwordOne, passwordTwo } =
      e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }

    try {
      firstname = validation.checkFirstNameAndLastName(
        firstname.value,
        "First Name"
      );
      lastname = validation.checkFirstNameAndLastName(
        lastname.value,
        "Last Name"
      );
      email = validation.checkEmail(email.value);
      // email = email.value (Cancel to use Steven's email address)
      passwordOne = validation.checkPassword(passwordOne.value);
    } catch (error) {
      alert(error);
      return false;
    }

    try {
      let user = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
        firstname
      );

      await addUser({
        variables: {
          id: user.uid.toString(),
          email: user.email,
          lastname: lastname,
          firstname: firstname,
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
                Sign Up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSignUp}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  name="firstname"
                  autoComplete="firstname"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  autoComplete="lastname"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="passwordOne"
                  label="Password"
                  type="password"
                  id="passwordOne"
                  autoComplete="password"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="passwordTwo"
                  label="Confirm Password"
                  type="password"
                  id="passwordTwo"
                  autoComplete="current-password"
                />
                {pwMatch && <Alert severity="error">{pwMatch}</Alert>}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
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
                        navigate("/login");
                      }}
                    >
                      {"Have an account? Sign In"}
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

export default SignUp;
