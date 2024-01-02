import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import PostCard from "./PostCard";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const FavoriteHolder = ({ favorite_products, favorite_posts }) => {
  const [productStatus, setProductStatus] = useState("active");
  const [productActive, setProductActive] = useState([]);
  const [productInactive, setProductInactive] = useState([]);
  const [productInProgress, setProductInProgress] = useState([]);
  const [productRejected, setProductRejected] = useState([]);
  const [productCompleted, setProductCompleted] = useState([]);
  const [currentProduct, setCurrentProduct] = useState([]);

  const [postStatus, setPostStatus] = useState("active");
  const [postActive, setPostActive] = useState([]);
  const [postInactive, setPostInactive] = useState([]);
  const [postInProgress, setPostInProgress] = useState([]);
  const [postRejected, setPostRejected] = useState([]);
  const [postCompleted, setPostCompleted] = useState([]);
  const [currentPost, setCurrentPost] = useState([]);

  useEffect(() => {
    let active = [];
    let inactive = [];
    let inprogress = [];
    let rejected = [];
    let completed = [];
    favorite_products.map((data) => {
      if (data.status == "active") {
        active.push(data);
      } else if (data.status == "inactive") {
        inactive.push(data);
      } else if (data.status == "pending") {
        inprogress.push(data);
      } else if (data.status == "rejected") {
        rejected.push(data);
      } else if (data.status == "completed") {
        completed.push(data);
      }
    });
    setProductActive(active);
    setProductInactive(inactive);
    setProductInProgress(inprogress);
    setProductRejected(rejected);
    setProductCompleted(completed);
  }, [favorite_products]);

  useEffect(() => {
    let active = [];
    let inactive = [];
    let inprogress = [];
    let rejected = [];
    let completed = [];
    favorite_posts.map((data) => {
      if (data.status == "active") {
        active.push(data);
      } else if (data.status == "inactive") {
        inactive.push(data);
      } else if (data.status == "pending") {
        inprogress.push(data);
      } else if (data.status == "rejected") {
        rejected.push(data);
      } else if (data.status == "completed") {
        completed.push(data);
      }
    });
    setPostActive(active);
    setPostInactive(inactive);
    setPostInProgress(inprogress);
    setPostRejected(rejected);
    setPostCompleted(completed);
  }, [favorite_posts]);

  useEffect(() => {
    if (productStatus == "active") {
      setCurrentProduct(productActive);
    } else if (productStatus == "inactive") {
      setCurrentProduct(productInactive);
    } else if (productStatus == "pending") {
      setCurrentProduct(productInProgress);
    } else if (productStatus == "rejected") {
      setCurrentProduct(productRejected);
    } else if (productStatus == "completed") {
      setCurrentProduct(productCompleted);
    }
  }, [
    productStatus,
    productActive,
    productInactive,
    productInProgress,
    productRejected,
    productCompleted,
  ]);

  useEffect(() => {
    if (postStatus == "active") {
      setCurrentPost(postActive);
    } else if (postStatus == "inactive") {
      setCurrentPost(postInactive);
    } else if (postStatus == "pending") {
      setCurrentPost(postInProgress);
    } else if (postStatus == "rejected") {
      setCurrentPost(postRejected);
    } else if (postStatus == "completed") {
      setCurrentPost(postCompleted);
    }
  }, [
    postStatus,
    postActive,
    postInactive,
    postInProgress,
    postRejected,
    postCompleted,
  ]);

  const handleProductStatusChange = (event) => {
    setProductStatus(event.target.value);
  };

  const handlePostStatusChange = (event) => {
    setPostStatus(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", mb: 3, justifyContent: "space-between" }}>
            <Typography variant="h5" component="p">
              My Favorite products
            </Typography>
            <FormControl sx={{ ml: 3, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Status</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={productStatus}
                label="Status"
                onChange={handleProductStatusChange}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem>
                <MenuItem value={"pending"}>In Progress</MenuItem>
                <MenuItem value={"rejected"}>Rejected</MenuItem>
                <MenuItem value={"completed"}>Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {currentProduct.length == 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1">No Result Found</Typography>
              </Grid>
            ) : (
              currentProduct.map((fav, index) => (
                <Grid item xs={4} md={4} lg={4} key={index}>
                  <ProductCard productData={fav} />
                </Grid>
              ))
            )}
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", mb: 3, justifyContent: "space-between" }}>
            <Typography variant="h5" component="p">
              My Favorite posts
            </Typography>
            <FormControl sx={{ ml: 3, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Status</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={postStatus}
                label="Status"
                onChange={handlePostStatusChange}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem>
                <MenuItem value={"pending"}>In Progress</MenuItem>
                <MenuItem value={"rejected"}>Rejected</MenuItem>
                <MenuItem value={"completed"}>Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {currentPost.length == 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1">No Result Found</Typography>
              </Grid>
            ) : (
              currentPost.map((fav, index) => (
                <Grid item xs={4} md={4} lg={4} key={index}>
                  <PostCard postData={fav} />
                </Grid>
              ))
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default FavoriteHolder;
