import React, { useState, useEffect, useRef, useContext } from "react";
import { EDIT_POST } from "../queries";
import { useMutation } from "@apollo/client";
import { uploadFileToS3 } from "../aws";
import OutlinedInput from "@mui/material/OutlinedInput";
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

const EditPost = ({ postData }) => {
  const { currentUser } = useContext(AuthContext);

  const [toggleEditForm, setToggleEditForm] = useState(false);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const conditionRef = useRef<HTMLSelectElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null);
  const sellerRef = useRef<HTMLSelectElement | null>(null);

  const [name, setName] = useState<string>(postData.item);
  const [category, setCategory] = useState<string>(postData.category);
  const [price, setPrice] = useState<number>(postData.price);
  const [condition, setCondition] = useState<string>(postData.condition);
  const [description, setDescription] = useState<string>(postData.description);

  const [status, setStatus] = useState<string>(postData.status);
  const [seller, setSeller] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<boolean>(false);
  const [conditionError, setConditionError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<boolean>(false);
  const [sellerError, setSellerError] = useState<boolean>(false);

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

    checkDescription: ()=> {
      setDescriptionError(false);
      let description= descriptionRef.current?.value;
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

    checkCategory: ()=> {
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

    checkStatus: ()=> {
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

    checkSeller: ()=>{
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
      helper.checkName();
      helper.checkCategory();
      helper.checkPrice();
      helper.checkCondition();
      helper.checkDescription();
      helper.checkStatus();
      if (status == "completed") {
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
        item: name,
        category: category,
        description: description,
        price: price,
        condition: condition,
        status: status,
      };

      if (status == "completed") {
        variables.seller_id = seller;
      }
      await editPost({ variables: variables });
    } catch (err) {
      alert;
    }
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        color="inherit"
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
                        defaultValue={condition}
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
                    defaultValue={description}
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
                          Seller
                        </InputLabel>
                        <Select
                          inputRef={sellerRef}
                          defaultValue={""}
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
