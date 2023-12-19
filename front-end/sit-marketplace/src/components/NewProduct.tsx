import { useState, useRef, useEffect, useContext } from "react";
import React from "react";
import { useNavigate, redirect } from "react-router-dom";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_PRODUCT, GET_PRODUCTS } from "../queries";
import { uploadFileToS3 } from "../aws.tsx";
import { AuthContext } from "../context/AuthContext";

import {
  Button,
  CssBaseline,
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

export default function SellForm() {
  const { currentUser } = useContext(AuthContext);
  let navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const conditionRef = useRef<HTMLSelectElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [condition, setCondition] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<boolean>(false);
  const [conditionError, setConditionError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const defaultTheme = createTheme();

  const [addProduct] = useMutation(ADD_PRODUCT, {
    onError: (e) => {
      alert(e);
    },
    onCompleted: () => {
      alert("Sucess");
      navigate("/products");
    },
  });
  // const [addProduct] = useMutation(ADD_PRODUCT, {
  //   update(cache, { data: { addProduct } }) {
  //     const { products } = cache.readQuery({ query: GET_PRODUCTS });
  //     cache.writeQuery({
  //       query: ADD_PRODUCT,
  //       data: { products: [...products, addProduct] },
  //     });
  //   },
  // });

  // useEffect(() => {
  //   if (!currentUser) {
  //     return navigate("/ogin");
  //   }
  // }, [currentUser]);

  const helper = {
    checkName(): void {
      setNameError(false);
      let input: string | undefined = nameRef.current?.value;
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

    checkPrice(): void {
      setPriceError(false);
      setPrice(0);
      let price: string | undefined = priceRef.current?.value;
      if (!price || price.trim() == "") {
        setPriceError(true);
        return;
      }
      price = price.trim();
      let value: number = parseFloat(price);
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

    checkCondition(): void {
      setConditionError(false);
      let condition: string | undefined = conditionRef.current?.value;
      if (!condition || condition.trim() == "") {
        setConditionError(true);
        return;
      }
      condition = condition.trim();
      let conditionLower: string = condition.toLowerCase();
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

    checkDescription(): void {
      setDescriptionError(false);
      let description: string | undefined = descriptionRef.current?.value;
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

    checkCategory(): void {
      setCategoryError(false);
      let category: string | undefined = categoryRef.current?.value;
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
        categoryLower != "stationery" &&
        categoryLower != "other"
      ) {
        setCategoryError(true);
        return;
      }
      setCategory(categoryLower);
    },

    checkImage(e: React.ChangeEvent<HTMLInputElement>): void {
      setImageError(false);
      const image: File | undefined = e.target.files?.[0];
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

  // const router = useRouter();
  // const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const image: File | undefined = e.target.files?.[0];
  //   if (!image) {
  //     return;
  //   }
  //   if (image.size > 10000000) {
  //     console.log("image size", image.size);
  //     return;
  //   }
  //   if (!image.type.match(/image.*/)) {
  //     console.log("image type", image.type);
  //     return;
  //   }
  //   setImage(image);
  // };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    helper.checkName();
    helper.checkPrice();
    helper.checkCondition();
    helper.checkDescription();
    helper.checkCategory();
    if (image == null) {
      setImageError(true);
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
      // console.log(
      //   "error",
      //   nameError,
      //   priceError,
      //   conditionError,
      //   descriptionError,
      //   categoryError
      // );
      return;
    }

    let imageUrl = await uploadFileToS3(image, name);

    await addProduct({
      variables: {
        name: name,
        price: price,
        condition: condition,
        description: description,
        category: category,
        sellerId: currentUser.uid,
        image: imageUrl,
      },
    });
  };

  // return (
  //   <div>
  //     <h2>Upload Item</h2>
  //     <div className="main">
  //       <div className="description">
  //         <p>
  //           Please fill out the form below to upload an item to the marketplace.
  //           Please ensure that all fields are filled out correctly.
  //         </p>
  //       </div>
  //       <div className="form">
  //         <form onSubmit={submit} encType="multipart/form-data">
  //           <label htmlFor="title">Title</label>
  //           <input
  //             type="text"
  //             id="title"
  //             name="title"
  //             ref={nameRef}
  //             onBlur={helper.checkName}
  //           />
  //           <label htmlFor="category">Category</label>
  //           <select
  //             name="category"
  //             id="category"
  //             ref={categoryRef}
  //             onBlur={helper.checkCategory}
  //             defaultValue={""}
  //           >
  //             <option disabled></option>
  //             <option>Book</option>
  //             <option>Clothing</option>
  //             <option>Electronics</option>
  //             <option>Furniture</option>
  //             <option>Stationary</option>
  //             <option>Other</option>
  //           </select>
  //           <label htmlFor="description">Description</label>
  //           <textarea
  //             id="description"
  //             name="description"
  //             rows={3}
  //             maxLength={100}
  //             ref={descriptionRef}
  //             onBlur={helper.checkDescription}
  //             defaultValue={""}
  //           />
  //           <label htmlFor="image">Image</label>
  //           <input
  //             type="file"
  //             id="image"
  //             name="image"
  //             ref={imageRef}
  //             onBlur={helper.checkImage}
  //           />
  //           <label htmlFor="price">Price</label>
  //           <input
  //             type="number"
  //             step="0.01"
  //             id="price"
  //             name="price"
  //             ref={priceRef}
  //             onBlur={helper.checkPrice}
  //           />
  //           <label htmlFor="category">Category</label>
  //           <select
  //             name="category"
  //             id="category"
  //             ref={categoryRef}
  //             onBlur={helper.checkCategory}
  //             defaultValue={""}
  //           >
  //             <option disabled></option>
  //             <option value="electronics">Electronics</option>
  //             <option value="clothing">Clothing</option>
  //             <option value="furniture">Furniture</option>
  //             <option value="books">Books</option>
  //             <option value="stationery">Stationery</option>
  //             <option value="other">Other</option>
  //           </select>
  //           <label htmlFor="condition">Condition</label>
  //           <select
  //             name="condition"
  //             id="condition"
  //             ref={conditionRef}
  //             onBlur={helper.checkCondition}
  //             defaultValue={""}
  //           >
  //             <option disabled></option>
  //             <option value="brand new">Brand New</option>
  //             <option value="like new">Like New</option>
  //             <option value="gently used">Gently Used</option>
  //             <option value="functional">Functional</option>
  //           </select>
  //           <label htmlFor="image">Image</label>
  //           <input type="file" id="image" name="image" ref={imageRef} onChange={uploadImage}/>
  //           <button type="submit">Submit</button>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
                    * Price should be in range from 0 to 100000 and have at most
                    2 demical places.
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
                  onBlur={helper.checkDescription}
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
    </ThemeProvider>
  );
}
