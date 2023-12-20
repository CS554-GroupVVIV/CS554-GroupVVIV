import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { ADD_POST, GET_POSTS } from "../queries";

import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";


export default function PostForm() {
  const { currentUser } = useContext(AuthContext);
  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const priceRef = useRef(null);
  const conditionRef = useRef(null);
  const descriptionRef = useRef(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [contidion, setCondition] = useState("");
  const [description, setdescription] = useState("");
  const [nameError, setNameError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [conditionError, setConditionError] = useState(false);
  const [descriptionError, setdescriptionError] = useState(false);

  const { data, loading, error } = useQuery(GET_POSTS);
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      const { posts } = cache.readQuery({
        query: GET_POSTS,
      });

      cache.writeQuery({
        query: GET_POSTS,
        data: { posts: [...posts, addPost] },
      });
    },
    onError: (e) => {
      alert(e);
    },
    onCompleted: () => {
      alert("Sucess");
      navigate("/posts");
    },
  });

  useEffect(() => {
    if (!currentUser) {
      return navigate("/login");
    }
  }, [currentUser]);

  const helper = {
    checkName: ()=> {
      setNameError(false);
      let input = nameRef.current?.value;
      if (!input || input.trim() == "") {
        setNameError(true);
        return;
      }
      input = input.trim();
      if (input.length < 0 || input.length > 20) {
        setNameError(true);
        return;
      }
      const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
      if (!alphanumericRegex.test(input)) {
        setNameError(true);
        return;
      }
      setName(input);
      return;
    },

    checkCategory: ()=> {
      setCategoryError(false);
      let input= categoryRef.current?.value;
      if (!input || input.trim() == "") {
        setCategoryError(true);
        return;
      }
      input = input.trim();
      let categoryLower = input.toLowerCase();
      if (
        categoryLower != "book" &&
        categoryLower != "other" &&
        categoryLower != "electronics" &&
        categoryLower != "clothing" &&
        categoryLower != "furniture" &&
        categoryLower != "stationary"
      ) {
        setCategoryError(true);
        return;
      }
      setCategory(input);
      return;
    },

    checkPrice: ()=> {
      setPriceError(false);
      setPrice(0);
      let price = priceRef.current?.value;
      if (!price || price.trim() == "") {
        setPriceError(true);
        return;
      }
      price = price.trim();
      let value = parseFloat(price);
      if (Number.isNaN(value)) {
        setPriceError(true);
        return;
      }
      price = (Math.round(value * 100) / 100).toFixed(2);
      if (value < 0 || value > 100000) {
        setPriceError(true);
        return;
      }
      if (priceRef.current) {
        priceRef.current.value = price;
      }
      setPrice(value);
      return;
    },

    checkCondition: ()=> {
      setConditionError(false);
      let condition= conditionRef.current?.value;
      if (!condition || condition.trim() == "") {
        setConditionError(true);
        return;
      }
      condition = condition.trim();
      let conditionLower = condition.toLowerCase();
      if (
        conditionLower != "brand new" &&
        conditionLower != "like new" &&
        conditionLower != "gently used" &&
        conditionLower != "functional"
      ) {
        setConditionError(true);
        return;
      }
      setCondition(condition);
    },

    checkdescription: ()=> {
      setdescriptionError(false);
      let description = descriptionRef.current?.value;
      if (description && description.trim() != "") {
        description = description.trim();
        if (description.length > 100) {
          setdescriptionError(true);
          return;
        } else {
          if (descriptionRef.current) {
            descriptionRef.current.value = description;
            setdescription(description);
          }
        }
      }
    },
  };

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    helper.checkName();
    helper.checkCategory();
    helper.checkPrice();
    helper.checkCondition();
    helper.checkdescription();
    if (
      nameError ||
      categoryError ||
      priceError ||
      conditionError ||
      descriptionError
    ) {
      return;
    }
    addPost({
      variables: {
        buyer_id: currentUser.uid,
        item: name,
        category: category,
        price: price,
        condition: contidion,
        description: description,
      },
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          New Post
        </Typography>

        <Typography component="span" variant="body1">
          We're excited to help you find the perfect item you're looking for!
          Please fill out the form with as much detail as possible. Your
          responses will not only help with the matching process but also
          increase the likelihood of finding your ideal item.
        </Typography>

        <Box component="form" noValidate onSubmit={submit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="item"
                required
                fullWidth
                id="item"
                label="Item Name"
                inputRef={nameRef}
                onBlur={helper.checkName}
              />
              {nameError && (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ color: "red" }}
                >
                  * Item name should be within range 1-20 characters and only
                  contain letters, numbers and spaces
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <div>
                <FormControl sx={{ minWidth: 200 }} required>
                  <InputLabel id="demo-simple-select-helper-label">
                    Category
                  </InputLabel>
                  <Select
                    inputRef={categoryRef}
                    defaultValue={""}
                    label="Category"
                    onBlur={helper.checkCategory}
                  >
                    <MenuItem value={"Book"}>Book</MenuItem>
                    <MenuItem value={"Clothing"}>Clothing</MenuItem>
                    <MenuItem value={"Electronics"}>Electronics</MenuItem>
                    <MenuItem value={"Furniture"}>Furniture</MenuItem>
                    <MenuItem value={"Stationary"}>Stationary</MenuItem>
                    <MenuItem value={"Other"}>Other</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {categoryError && (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ color: "red" }}
                >
                  * Please select from provided categories
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="price"
                label="Price"
                name="price"
                type="number"
                inputRef={priceRef}
                onBlur={helper.checkPrice}
              />
              {priceError && (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ color: "red" }}
                >
                  * Price should be in range from 0 to 100000 and have at most 2
                  demical places.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <div>
                <FormControl sx={{ minWidth: 200 }} required>
                  <InputLabel id="demo-simple-select-helper-label">
                    Condition
                  </InputLabel>
                  <Select
                    inputRef={conditionRef}
                    defaultValue={""}
                    label="Condition"
                    onBlur={helper.checkCondition}
                  >
                    <MenuItem value={"Brand New"}>Brand New</MenuItem>
                    <MenuItem value={"Like New"}>Like New</MenuItem>
                    <MenuItem value={"Gently Used"}>Gently Used</MenuItem>
                    <MenuItem value={"Functional"}>Functional</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {conditionError && (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ color: "red" }}
                >
                  * Please select from provided options
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="about"
                label="Descriptional Preference (100 letters max)"
                name="about"
                defaultValue={""}
                inputRef={descriptionRef}
                onBlur={helper.checkdescription}
              />
              {descriptionError && (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ color: "red" }}
                >
                  * Description should have 100 letters at most
                </Typography>
              )}
            </Grid>
          </Grid>
          <br />
          <Stack spacing={2} direction="row">
            <Button
              type="button"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => navigate("/posts")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
