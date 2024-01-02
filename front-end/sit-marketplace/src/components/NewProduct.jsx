import { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import { ADD_PRODUCT } from "../queries";
import { uploadFileToS3 } from "../aws";

import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";

export default function SellForm() {
  const { currentUser } = useContext(AuthContext);
  let navigate = useNavigate();

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const conditionRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [conditionError, setConditionError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [addProduct] = useMutation(ADD_PRODUCT, {
    onError: (e) => {
      alert(e);
    },
    onCompleted: () => {
      alert("Sucess");
      navigate("/products");
    },
  });

  const helper = {
    checkName: () => {
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

    checkPrice: () => {
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

    checkCondition: () => {
      setConditionError(false);
      let condition = conditionRef.current?.value;
      if (!condition || condition.trim() == "") {
        setConditionError(true);
        return;
      }
      condition = condition.trim();
      let conditionLower = condition.toLowerCase();
      if (
        conditionLower !== "brand new" &&
        conditionLower != "like new" &&
        conditionLower !== "gently used" &&
        conditionLower !== "functional"
      ) {
        setConditionError(true);
        return;
      }
      setCondition(conditionLower);
    },

    checkDescription: () => {
      setDescriptionError(false);
      let description = descriptionRef.current?.value;
      if (description && description.trim() != "") {
        description = description.trim();
        if (description.length > 100) {
          setDescriptionError(true);
          return;
        } else {
          if (descriptionRef.current) {
            descriptionRef.current.value = description;
            setDescription(description);
          }
        }
      }
    },

    checkCategory: () => {
      setCategoryError(false);
      let category = categoryRef.current?.value;
      if (!category || category.trim() == "") {
        setCategoryError(true);
        return;
      }
      category = category.trim();
      const categoryLower = category.toLowerCase();
      if (
        categoryLower != "electronics" &&
        categoryLower != "clothing" &&
        categoryLower != "furniture" &&
        categoryLower != "book" &&
        categoryLower != "stationary" &&
        categoryLower != "other"
      ) {
        setCategoryError(true);
        return;
      }
      setCategory(categoryLower);
    },

    checkImage: (e) => {
      setImageError(false);
      const image = e.target.files?.[0];
      if (!image || !(image instanceof File)) {
        setImageError(true);
        return;
      }
      if (image.size > 10000000) {
        setImageError(true);
        console.log("image size", image.size);
        return;
      }
      if (!image.type.match(/image.*/)) {
        setImageError(true);
        console.log("image type", image.type);
        return;
      }
      setImage(image);
    },
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    helper.checkName();
    helper.checkPrice();
    helper.checkCondition();
    helper.checkDescription();
    helper.checkCategory();
    if (image == null) {
      setImageError(true);
      setSubmitting(false);
      return;
    }
    if (
      nameError ||
      priceError ||
      conditionError ||
      descriptionError ||
      categoryError ||
      imageError
    ) {
      setSubmitting(false);
      return;
    }

    let imageUrl = await uploadFileToS3(image, name);

    addProduct({
      variables: {
        sellerId: currentUser.uid,
        name: name,
        category: category,
        price: price,
        condition: condition,
        description: description,
        image: imageUrl,
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
          New Product
        </Typography>
        <Typography component="span" variant="body1">
          Please fill out the form below to upload an item to the marketplace.
          Please ensure that all fields are filled out correctly.
        </Typography>

        <Box component="form" noValidate onSubmit={submit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                required
                fullWidth
                id="title"
                label="Item Name"
                inputRef={nameRef}
                onBlur={helper.checkName}
                inputProps={{ minLength: 1, maxLength: 20 }}
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
                    <MenuItem value={"book"}>Book</MenuItem>
                    <MenuItem value={"clothing"}>Clothing</MenuItem>
                    <MenuItem value={"electronics"}>Electronics</MenuItem>
                    <MenuItem value={"furniture"}>Furniture</MenuItem>
                    <MenuItem value={"stationary"}>Stationary</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
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
              <div>
                {/* <label htmlFor="image">
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Image *
                    </Button>
                  </label> */}
                <input
                  name="image"
                  id="image"
                  type="file"
                  // inputRef={imageRef}
                  onChange={(e) => {
                    helper.checkImage(e);
                  }}
                  // style={{ opacity: 0, zIndex: -1 }}
                />
              </div>
              {imageError && (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ color: "red" }}
                >
                  * Please upload an image with size &lt; 10MB and the correct
                  file type.
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
                    <MenuItem value={"brand new"}>Brand New</MenuItem>
                    <MenuItem value={"like new"}>Like New</MenuItem>
                    <MenuItem value={"gently used"}>Gently Used</MenuItem>
                    <MenuItem value={"functional"}>Functional</MenuItem>
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
                onBlur={helper.checkDescription}
                inputProps={{ maxLength: 100 }}
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
              disabled={submitting}
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
