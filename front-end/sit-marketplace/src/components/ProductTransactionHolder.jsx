import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import PostCard from "./PostCard.jsx";
import {
  Paper,
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const ProductTransactionHolder = ({ purchaseData, soldData }) => {
  const [purchasedStatus, setPurchasedStatus] = useState("completed");
  const [soldStatus, setSoldStatus] = useState("completed");

  const [purchaseActive, setPurchaseActive] = useState([]);
  const [purchaseInactive, setPurchaseInactive] = useState([]);
  const [purchaseCompleted, setPurchaseCompleted] = useState([]);
  const [soldActive, setSoldActive] = useState([]);
  const [soldInactive, setSoldInactive] = useState([]);
  const [soldCompleted, setSoldCompleted] = useState([]);
  const [currentPurchase, setCurrentPurchase] = useState([]);
  const [currentSold, setCurrentSold] = useState([]);

  // useEffect(() => {
  //   let active = [];
  //   let inactive = [];
  //   let completed = [];
  //   if (purchaseData && purchaseData.length > 0) {
  //     purchaseData.map((data) => {
  //       if (data.status == "active") {
  //         active.push(data);
  //       } else if (data.status == "inactive") {
  //         inactive.push(data);
  //       } else if (data.status == "completed") {
  //         completed.push(data);
  //       }
  //     });
  //   }
  //   setPurchaseActive(active);
  //   setPurchaseInactive(inactive);
  //   setPurchaseCompleted(completed);
  // }, [purchaseData]);

  useEffect(() => {
    let active = [];
    let inactive = [];
    let completed = [];
    if (soldData && soldData.length > 0) {
      soldData.map((data) => {
        if (data.status == "active") {
          active.push(data);
        } else if (data.status == "inactive") {
          inactive.push(data);
        } else if (data.status == "completed") {
          completed.push(data);
        }
      });
    }
    setSoldActive(active);
    setSoldInactive(inactive);
    setSoldCompleted(completed);
  }, [soldData]);

  // useEffect(() => {
  //   if (purchasedStatus == "active") {
  //     setCurrentPurchase(purchaseActive);
  //   } else if (purchasedStatus == "inactive") {
  //     setCurrentPurchase(purchaseInactive);
  //   } else if (purchasedStatus == "completed") {
  //     setCurrentPurchase(purchaseCompleted);
  //   }
  // }, [purchasedStatus, purchaseActive, purchaseInactive, purchaseCompleted]);

  // const handlePurchasedStatusChange = (event) => {
  //   setPurchasedStatus(event.target.value);
  // };

  useEffect(() => {
    if (soldStatus == "active") {
      setCurrentSold(soldActive);
    } else if (soldStatus == "inactive") {
      setCurrentSold(soldInactive);
    } else if (soldStatus == "completed") {
      setCurrentSold(soldCompleted);
    }
  }, [soldStatus, soldActive, soldInactive, soldCompleted]);

  const handleSoldStatusChange = (event) => {
    setSoldStatus(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ marginBottom: 2 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          {/* <Box sx={{ display: "flex" }}> */}
          <Typography variant="h5" component="p">
            Purchased
          </Typography>
          {/* <FormControl sx={{ ml: 3, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Status</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={purchasedStatus}
                label="Status"
                onChange={handlePurchasedStatusChange}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem>
                <MenuItem value={"completed"}>Completed</MenuItem>
              </Select>
            </FormControl> */}
          {/* </Box> */}
          <Grid container spacing={3}>
            {currentPurchase.length == 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" component="p">
                  No Result Found
                </Typography>
              </Grid>
            ) : (
              currentPurchase.map((purchase, index) => (
                <Grid item xs={4} key={index}>
                  <ProductCard productData={purchase} />
                </Grid>
              ))
            )}
          </Grid>
        </Paper>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", mb: 3, justifyContent: "space-between" }}>
            <Typography variant="h5">
              {soldStatus == "completed"
                ? "Sold"
                : soldStatus == "active"
                ? "Selling"
                : "Recalled selling"}
            </Typography>
            <FormControl
              sx={{
                ml: 3,
                minWidth: 120,
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label">Status</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={soldStatus}
                label="Status"
                onChange={handleSoldStatusChange}
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"inactive"}>Inactive</MenuItem>
                <MenuItem value={"completed"}>Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Grid container spacing={3}>
            {currentSold.length == 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1">No Result Found</Typography>
              </Grid>
            ) : (
              currentSold.map((sold, index) => (
                <Grid item xs={4} key={index}>
                  <ProductCard productData={sold} />
                </Grid>
              ))
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductTransactionHolder;
