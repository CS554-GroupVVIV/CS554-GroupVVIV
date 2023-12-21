import React, { useState, useRef } from "react";
import { EDIT_PRODUCT } from "../queries";
import { useMutation } from "@apollo/client";
import { uploadFileToS3 } from "../aws";
import { AuthContext } from "../context/AuthContext";

import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const EditProduct = ({ productData }) => {
  const { currentUser } = useContext(AuthContext);

  // const [image, setImage] = useState<File | undefined>(undefined);
  const [toggleEditForm, setToggleEditForm] = useState(false);

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const conditionRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const imageRef = useRef(null);
  const statusRef = useRef(null);
  const buyerRef = useRef(null);

  const [name, setName] = useState(productData.name);
  const [category, setCategory] = useState(productData.category);
  const [image, setImage] = useState(productData.image);
  const [price, setPrice] = useState(productData.price);
  const [condition, setCondition] = useState(productData.condition);
  const [description, setDescription] = useState(productData.description);

  const [status, setStatus] = useState(productData.status);
  const [buyer, setBuyer] = useState("");
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [conditionError, setConditionError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [buyerError, setBuyerError] = useState(false);

  const [editProduct] = useMutation(EDIT_PRODUCT, {
    onError: (e) => {
      alert(e);
    },
    onCompleted: () => {
      alert("Sucess");
      setToggleEditForm(false);
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
        categoryLower != "stationery" &&
        categoryLower != "other"
      ) {
        setCategoryError(true);
        return;
      }
      setCategory(category);
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

    checkStatus: () => {
      setStatusError(false);
      let status = statusRef.current?.value;
      if (!status || status.trim() == "") {
        setStatusError(true);
        return;
      }
      status = status.trim();
      const statusLower = status.toLowerCase();
      if (
        statusLower != "active" &&
        statusLower != "inactive" &&
        statusLower != "completed"
      ) {
        setStatusError(true);
        return;
      }
      setStatus(statusLower);
    },

    checkBuyer: () => {
      setBuyerError(false);
      let buyer = buyerRef.current?.value;
      if (!buyer || buyer.trim() == "") {
        setBuyerError(true);
        return;
      }
      buyer = buyer.trim();

      let flag = false;
      productData.possible_buyers.map((possible_buyer) => {
        if (possible_buyer._id == buyer) {
          setBuyer(buyer);
          flag = true;
        }
      });
      if (!flag) setBuyerError(true);
    },
  };

  const editSubmit = async () => {
    try {
      helper.checkName();
      helper.checkCategory();
      helper.checkPrice();
      helper.checkCondition();
      helper.checkDescription();
      helper.checkStatus();
      if (
        nameError ||
        priceError ||
        conditionError ||
        descriptionError ||
        categoryError ||
        imageError ||
        statusError
      ) {
        return;
      }

      console.log(name);
      console.log(category);

      if (
        name == productData.name &&
        category == productData.category &&
        price == productData.price &&
        condition == productData.condition &&
        description == productData.description &&
        status == productData.status &&
        image == null
      ) {
        alert("No change made");
        return;
      }

      let imageUrl = productData.image;
      if (image && image != imageUrl) {
        imageUrl = await uploadFileToS3(image, name);
      }

      let variables = {
        id: productData._id,
        name: name,
        description: description,
        sellerId: currentUser.uid,
        price: price,
        category: category,
        condition: condition,
        status: status,
        image: imageUrl,
      };

      if (status == "completed") {
        variables.buyerId = buyer;
      }
      console.log("variables", variables);
      await editProduct({ variables: variables });
    } catch (err) {
      alert;
    }
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        // color="inherit"
        onClick={() => setToggleEditForm(true)}
      >
        Edit
      </Button>
      <Dialog open={toggleEditForm} maxWidth="md">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please fill out the form below to upload an item to the marketplace.
            Please ensure that all fields are filled out correctly.
          </DialogContentText>
          <Box
            component="form"
            noValidate
            sx={{ mt: 3, display: "flex", flexWrap: "wrap" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Item Name"
                  inputRef={nameRef}
                  defaultValue={name}
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
                      label="Category"
                      defaultValue={category}
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
                  defaultValue={price}
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
                      defaultValue={condition}
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
                  defaultValue={description}
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
              <Grid item xs={12}>
                <div>
                  <FormControl sx={{ minWidth: 200 }} required>
                    <InputLabel id="demo-simple-select-helper-label">
                      Status
                    </InputLabel>
                    <Select
                      inputRef={statusRef}
                      defaultValue={status}
                      label="Status"
                      onBlur={helper.checkStatus}
                    >
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"inactive"}>Retrieve</MenuItem>
                      <MenuItem value={"completed"}>Completed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {statusError && (
                  <Typography
                    component="span"
                    variant="body2"
                    style={{ color: "red" }}
                  >
                    * Please select from provided options
                  </Typography>
                )}
              </Grid>

              {status == "completed" && (
                <Grid item xs={12}>
                  <div>
                    <FormControl sx={{ minWidth: 200 }} required>
                      <InputLabel id="demo-simple-select-helper-label">
                        Buyer
                      </InputLabel>
                      <Select
                        inputRef={buyerRef}
                        defaultValue={""}
                        label="Buyer"
                        onBlur={helper.checkBuyer}
                      >
                        {productData.possible_buyers.length === 0 ? (
                          <MenuItem value="" disabled>
                            No Availabile Options
                          </MenuItem>
                        ) : (
                          productData.possible_buyers.map((buyer) => {
                            return (
                              <MenuItem key={buyer._id} value={buyer._id}>
                                {buyer.firstname} {buyer.lastname}
                              </MenuItem>
                            );
                          })
                        )}
                      </Select>
                    </FormControl>
                  </div>
                  {buyerError && (
                    <Typography
                      component="span"
                      variant="body2"
                      style={{ color: "red" }}
                    >
                      * Please select from provided options
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>
            <br />
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                setToggleEditForm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editSubmit}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProduct;
