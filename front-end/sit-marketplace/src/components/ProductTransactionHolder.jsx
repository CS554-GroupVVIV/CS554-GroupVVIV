import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ProductCard from "./ProductCard";
import {
  GET_PRODUCTS_BY_BUYER,
  GET_PRODUCTS_BY_SELLER,
  CLEAR_PRODUCT_BUY,
  CLEAR_PRODUCT_SELL,
} from "../queries";
import {
  Paper,
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  Button,
  MenuItem,
} from "@mui/material";

const ProductTransactionHolder = ({ userData }) => {
  const [sellStatus, setSellStatus] = useState("completed");
  const [sellActive, setSellActive] = useState([]);
  const [sellInactive, setSellInactive] = useState([]);
  const [sellPending, setSellPending] = useState([]);
  const [sellRejected, setSellRejected] = useState([]);
  const [sellCompleted, setSellCompleted] = useState([]);
  const [currentSell, setCurrentSell] = useState([]);

  const [purchaseStatus, setPurchaseStatus] = useState("completed");
  const [purchaseActive, setPurchaseActive] = useState([]);
  const [purchaseInactive, setPurchaseInactive] = useState([]);
  const [purchasePending, setPurchasePending] = useState([]);
  const [purchaseInProgress, setPurchaseInProgress] = useState([]);
  const [purchaseRejected, setPurchaseRejected] = useState([]);
  const [purchaseCompleted, setPurchaseCompleted] = useState([]);
  const [currentPurchase, setCurrentPurchase] = useState([]);

  const {
    data: productSeller,
    loading: productSellerLoading,
    error: productSellerError,
  } = useQuery(GET_PRODUCTS_BY_SELLER, {
    variables: { id: userData._id },
  });

  const {
    data: productBuyer,
    loading: productBuyerLoading,
    error: productBuyerError,
  } = useQuery(GET_PRODUCTS_BY_BUYER, {
    variables: { id: userData._id },
  });

  useEffect(() => {
    if (productSeller) {
      let active = [];
      let inactive = [];
      let pending = [];
      let rejected = [];
      let completed = [];
      let sellData = productSeller.getProductBySeller;
      if (sellData && sellData.length > 0) {
        sellData.map((data) => {
          if (data.status == "active") {
            active.push(data);
          } else if (data.status == "inactive") {
            inactive.push(data);
          } else if (data.status == "pending") {
            pending.push(data);
          } else if (data.status == "rejected") {
            rejected.push(data);
          } else if (data.status == "completed") {
            completed.push(data);
          }
        });
      }
      setSellActive(active);
      setSellInactive(inactive);
      setSellPending(pending);
      setSellRejected(rejected);
      setSellCompleted(completed);
    }
  }, [productSeller]);

  // useEffect(() => {
  //   let active = [];
  //   let inactive = [];
  //   let pending = [];
  //   let inprogress = [];
  //   let rejected = [];
  //   if (userData.possible_buyer.length > 0) {
  //     userData.possible_buyer.map((data) => {
  //       if (data.status == "active") {
  //         active.push(data);
  //       } else if (data.status == "inactive") {
  //         inactive.push(data);
  //       } else if (data.status == "pending") {
  //         if (data.buyer._id == userData._id) {
  //           pending.push(data);
  //         } else {
  //           inprogress.push(data);
  //         }
  //       } else if (data.status == "rejected") {
  //         rejected.push(data);
  //       }
  //     });
  //   }
  //   setPurchaseActive(active);
  //   setPurchaseInactive(inactive);
  //   setPurchasePending(pending);
  //   setPurchaseInProgress(inprogress);
  //   setPurchaseRejected(rejected);
  // }, [userData]);

  // useEffect(() => {
  //   if (productBuyer) {
  //     let completed = productBuyer.getProductByBuyer.filter((data) => {
  //       return data.status == "completed";
  //     });
  //     setPurchaseCompleted(completed);
  //   }
  // }, [productBuyer]);

  useEffect(() => {
    if (sellStatus == "active") {
      setCurrentSell(sellActive);
    } else if (sellStatus == "inactive") {
      setCurrentSell(sellInactive);
    } else if (sellStatus == "pending") {
      setCurrentSell(sellPending);
    } else if (sellStatus == "rejected") {
      setCurrentSell(sellRejected);
    } else if (sellStatus == "completed") {
      setCurrentSell(sellCompleted);
    }
  }, [
    sellStatus,
    // sellActive,
    // sellInactive,
    // sellPending,
    // sellRejected,
    // sellCompleted,
  ]);

  useEffect(() => {
    if (purchaseStatus == "active") {
      let active = [];
      if (userData.possible_buyer.length > 0) {
        userData.possible_buyer.map((data) => {
          if (data.status == "active") {
            active.push(data);
          }
        });
        setCurrentPurchase(active);
      }
    } else if (purchaseStatus == "inactive") {
      let inactive = [];
      if (userData.possible_buyer.length > 0) {
        userData.possible_buyer.map((data) => {
          if (data.status == "inactive") {
            inactive.push(data);
          }
        });
        setCurrentPurchase(inactive);
      }
    } else if (purchaseStatus == "pending") {
      let pending = [];
      if (userData.possible_buyer.length > 0) {
        userData.possible_buyer.map((data) => {
          if (data.status == "pending" && data.buyer._id == userData._id) {
            pending.push(data);
          }
        });
        setCurrentPurchase(pending);
      }
    } else if (purchaseStatus == "rejected") {
      let rejected = [];
      if (userData.possible_buyer.length > 0) {
        userData.possible_buyer.map((data) => {
          if (data.status == "rejected") {
            rejected.push(data);
          }
        });
        setCurrentPurchase(rejected);
      }
    } else if (purchaseStatus == "in progress") {
      let inprogress = [];
      if (userData.possible_buyer.length > 0) {
        userData.possible_buyer.map((data) => {
          if (data.status == "pending" && data.buyer._id != userData._id) {
            inprogress.push(data);
          }
        });
        setCurrentPurchase(inprogress);
      }
    } else if (purchaseStatus == "completed") {
      if (productBuyer) {
        let completed = productBuyer.getProductByBuyer.filter((data) => {
          return data.status == "completed";
        });
        setCurrentPurchase(completed);
      }
    }
  }, [purchaseStatus]);

  const handleSellStatusChange = (event) => {
    setSellStatus(event.target.value);
  };

  const handlePurchaseStatusChange = (event) => {
    setPurchaseStatus(event.target.value);
  };

  // const [clearProductBuy] = useMutation(CLEAR_PRODUCT_BUY, {
  // refetchQueries: [
  //   {
  //     query: GET_PRODUCTS_BY_BUYER,
  //     variables: { id: userData._id },
  //   },
  // ],
  // onCompleted: () => {
  //   setPurchaseInactive([]);
  // },
  // });
  const [clearProductSell] = useMutation(CLEAR_PRODUCT_SELL, {
    // refetchQueries: [
    //   {
    //     query: GET_PRODUCTS_BY_SELLER,
    //     variables: { id: userData._id },
    //   },
    // ],
    onCompleted: () => {
      setSellInactive([]);
    },
  });

  if (productSellerLoading || productBuyerLoading) {
    return <p>Loading</p>;
  } else if (productSellerError || productBuyerError) {
    return <p>Something went wrong</p>;
  } else {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{ display: "flex", mb: 3, justifyContent: "space-between" }}
            >
              <Typography variant="h6">
                {purchaseStatus == "completed"
                  ? "Purchased"
                  : purchaseStatus == "active"
                  ? "You are a candidate buyer"
                  : purchaseStatus == "inactive"
                  ? "You cannot buy these items anymore..."
                  : purchaseStatus == "pending"
                  ? "Waiting for your confirmatioin"
                  : purchaseStatus == "in progress"
                  ? "In progress with other users"
                  : "Rejected by other users, will probably be back soon"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* {purchaseStatus == "inactive" && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      clearProductBuy({ variables: { _id: userData._id } });
                    }}
                  >
                    Clear all
                  </Button>
                )} */}
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
                    value={purchaseStatus}
                    label="Status"
                    onChange={handlePurchaseStatusChange}
                  >
                    <MenuItem value={"active"}>Active</MenuItem>
                    <MenuItem value={"inactive"}>Inactive</MenuItem>
                    <MenuItem value={"pending"}>Action Required</MenuItem>
                    <MenuItem value={"in progress"}>In Progress</MenuItem>
                    <MenuItem value={"rejected"}>Rejected</MenuItem>
                    <MenuItem value={"completed"}>Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

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
            <Box
              sx={{ display: "flex", mb: 3, justifyContent: "space-between" }}
            >
              <Typography variant="h6">
                {sellStatus == "completed"
                  ? "Sold"
                  : sellStatus == "active"
                  ? "Selling"
                  : sellStatus == "inactive"
                  ? "Recalled selling"
                  : sellStatus == "pending"
                  ? "Pending confirmation from buyer"
                  : "Your offer was rejected"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {sellStatus == "inactive" && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      clearProductSell({ variables: { _id: userData._id } });
                    }}
                  >
                    Clear all
                  </Button>
                )}
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
                    value={sellStatus}
                    label="Status"
                    onChange={handleSellStatusChange}
                  >
                    <MenuItem value={"active"}>Active</MenuItem>
                    <MenuItem value={"inactive"}>Inactive</MenuItem>
                    <MenuItem value={"pending"}>Pending</MenuItem>
                    <MenuItem value={"rejected"}>Rejected</MenuItem>
                    <MenuItem value={"completed"}>Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Grid container spacing={3}>
              {currentSell.length == 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body1">No Result Found</Typography>
                </Grid>
              ) : (
                currentSell.map((sell, index) => (
                  <Grid item xs={4} key={index}>
                    <ProductCard productData={sell} />
                  </Grid>
                ))
              )}
            </Grid>
          </Paper>
        </Box>
      </Container>
    );
  }
};

export default ProductTransactionHolder;
