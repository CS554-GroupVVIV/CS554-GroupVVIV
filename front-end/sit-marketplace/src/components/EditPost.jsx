import React, { useState, useRef, useContext } from "react";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../context/AuthContext";
import { EDIT_POST } from "../queries";
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

const EditPost = ({ postData }) => {
  const { currentUser } = useContext(AuthContext);

  const [toggleEditForm, setToggleEditForm] = useState(false);

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const conditionRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const statusRef = useRef(null);
  const sellerRef = useRef(null);

  const [name, setName] = useState(postData.name);
  const [category, setCategory] = useState(postData.category);
  const [price, setPrice] = useState(postData.price);
  const [condition, setCondition] = useState(postData.condition);
  const [description, setDescription] = useState(postData.description);
  const [status, setStatus] = useState(postData.status);
  const [seller, setSeller] = useState("");
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [conditionError, setConditionError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [sellerError, setSellerError] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [editPost] = useMutation(EDIT_POST, {
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
        categoryLower != "stationary" &&
        categoryLower != "other"
      ) {
        setCategoryError(true);
        return;
      }
      setCategory(category);
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
        statusLower != "pending"
      ) {
        setStatusError(true);
        return;
      }
      setStatus(statusLower);
    },

    checkSeller: () => {
      setSellerError(false);
      let seller = sellerRef.current?.value;
      if (!seller || seller.trim() == "") {
        setSellerError(true);
        return;
      }
      seller = seller.trim();

      let flag = false;
      postData.possible_sellers.map((possible_sellers) => {
        if (possible_sellers._id == seller) {
          setSeller(seller);
          flag = true;
        }
      });
      if (!flag) setSellerError(true);
    },
  };

  const editSubmit = async () => {
    try {
      setSubmitting(true);
      helper.checkName();
      helper.checkCategory();
      helper.checkPrice();
      helper.checkCondition();
      helper.checkDescription();
      helper.checkStatus();
      if (status == "pending") {
        helper.checkSeller();
      }
      if (
        nameError ||
        priceError ||
        conditionError ||
        descriptionError ||
        categoryError ||
        statusError
      ) {
        setSubmitting(false);
        return;
      }

      if (
        name == postData.item &&
        category == postData.category &&
        price == postData.price &&
        condition == postData.condition &&
        description == postData.description &&
        status == postData.status
      ) {
        alert("No change made");
        return;
      }

      let variables = {
        id: postData._id,
        buyer_id: currentUser.uid,
        name: name,
        category: category,
        price: price,
        condition: condition,
        description: description,
        status: status,
      };

      if (status == "pending") {
        variables.seller_id = seller;
      }
      await editPost({ variables: variables });
    } catch (err) {
      alert(err);
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
      <div className="modal-box">
        <Dialog open={toggleEditForm} maxWidth="md">
          <DialogTitle>Edit Post</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please fill out the form below to upload an item to the
              marketplace. Please ensure that all fields are filled out
              correctly.
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
                      * Item name should be within range 1-20 characters and
                      only contain letters, numbers and spaces
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
                        // defaultValue={category}
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
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
                      * Price should be in range from 0 to 100000 and have at
                      most 2 demical places.
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
                        // defaultValue={condition}
                        value={condition}
                        onChange={(e) => {
                          setCondition(e.target.value);
                        }}
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
                        // defaultValue={status}
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                        }}
                        label="Status"
                        onBlur={helper.checkStatus}
                      >
                        <MenuItem value={"active"}>Active</MenuItem>
                        <MenuItem value={"inactive"}>Retrieve</MenuItem>
                        <MenuItem value={"rejected"} disabled>
                          Rejected
                        </MenuItem>
                        <MenuItem value={"pending"}>In Progress</MenuItem>
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

                {status == "pending" && (
                  <Grid item xs={12}>
                    <div>
                      <FormControl sx={{ minWidth: 200 }} required>
                        <InputLabel id="demo-simple-select-helper-label">
                          Seller
                        </InputLabel>
                        <Select
                          inputRef={sellerRef}
                          // defaultValue={""}
                          value={seller}
                          onChange={(e) => {
                            setSeller(e.target.value);
                          }}
                          label="Buyer"
                          onBlur={helper.checkSeller}
                        >
                          {postData.possible_sellers.length === 0 ? (
                            <MenuItem value="" disabled>
                              No Availabile Options
                            </MenuItem>
                          ) : (
                            postData.possible_sellers.map((seller) => {
                              return (
                                <MenuItem key={seller._id} value={seller._id}>
                                  {seller.firstname} {seller.lastname}
                                </MenuItem>
                              );
                            })
                          )}
                        </Select>
                      </FormControl>
                    </div>
                    {sellerError && (
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
      </div>
    </>
  );
};

export default EditPost;
