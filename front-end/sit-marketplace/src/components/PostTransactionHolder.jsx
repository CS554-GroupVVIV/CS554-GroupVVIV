import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import PostCard from "./PostCard";
import {
  GET_POSTS_BY_BUYER,
  GET_POSTS_BY_SELLER,
  CLEAR_POST_BUY,
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

const PostTransactionHolder = ({ userData }) => {
  const [purchaseStatus, setPurchaseStatus] = useState("completed");
  const [purchaseActive, setPurchaseActive] = useState([]);
  const [purchaseInactive, setPurchaseInactive] = useState([]);
  const [purchasePending, setPurchasePending] = useState([]);
  const [purchaseRejected, setPurchaseRejected] = useState([]);
  const [purchaseCompleted, setPurchaseCompleted] = useState([]);
  const [currentPurchase, setCurrentPurchase] = useState([]);

  const [sellStatus, setSellStatus] = useState("completed");
  const [sellActive, setSellActive] = useState([]);
  const [sellInactive, setSellInactive] = useState([]);
  const [sellPending, setSellPending] = useState([]);
  const [sellInProgress, setSellInProgress] = useState([]);
  const [sellRejected, setSellRejected] = useState([]);
  const [sellCompleted, setSellCompleted] = useState([]);
  const [currentSell, setCurrentSell] = useState([]);

  const {
    data: postSeller,
    loading: postSellerLoading,
    error: postSellerError,
  } = useQuery(GET_POSTS_BY_SELLER, {
    variables: { _id: userData._id },
  });

  const {
    data: postBuyer,
    loading: postBuyerLoading,
    error: postBuyerError,
  } = useQuery(GET_POSTS_BY_BUYER, {
    variables: { _id: userData._id },
  });

  useEffect(() => {
    if (postBuyer) {
      let active = [];
      let inactive = [];
      let pending = [];
      let rejected = [];
      let completed = [];
      let purchaseData = postBuyer.getPostByBuyer;
      if (purchaseData && purchaseData.length > 0) {
        purchaseData.map((data) => {
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
      setPurchaseActive(active);
      setPurchaseInactive(inactive);
      setPurchasePending(pending);
      setPurchaseRejected(rejected);
      setPurchaseCompleted(completed);
    }
  }, [postBuyer]);

  useEffect(() => {
    let active = [];
    let inactive = [];
    let pending = [];
    let rejected = [];
    let inprogress = [];
    if (userData.possible_seller.length > 0) {
      userData.possible_seller.map((data) => {
        if (data.status == "active") {
          active.push(data);
        } else if (data.status == "inactive") {
          inactive.push(data);
        } else if (data.status == "pending") {
          if (data.seller._id == userData._id) {
            pending.push(data);
          } else {
            inprogress.push(data);
          }
        } else if (data.status == "rejected") {
          rejected.push(data);
        }
      });
    }
    setSellActive(active);
    setSellInactive(inactive);
    setSellPending(pending);
    setSellInProgress(inprogress);
    setSellRejected(rejected);
  }, [userData]);

  useEffect(() => {
    if (postSeller) {
      let completed = postSeller.getPostBySeller.filter((data) => {
        return data.status == "completed";
      });
      setSellCompleted(completed);
    }
  }, [postSeller]);

  useEffect(() => {
    if (purchaseStatus == "active") {
      setCurrentPurchase(purchaseActive);
    } else if (purchaseStatus == "inactive") {
      setCurrentPurchase(purchaseInactive);
    } else if (purchaseStatus == "pending") {
      setCurrentPurchase(purchasePending);
    } else if (purchaseStatus == "rejected") {
      setCurrentPurchase(purchaseRejected);
    } else if (purchaseStatus == "completed") {
      setCurrentPurchase(purchaseCompleted);
    }
  }, [
    purchaseStatus,
    purchaseActive,
    purchaseInactive,
    purchasePending,
    purchaseRejected,
    purchaseCompleted,
  ]);

  useEffect(() => {
    if (sellStatus == "active") {
      setCurrentSell(sellActive);
    } else if (sellStatus == "inactive") {
      setCurrentSell(sellInactive);
    } else if (sellStatus == "pending") {
      setCurrentSell(sellPending);
    } else if (sellStatus == "in progress") {
      setCurrentSell(sellInProgress);
    } else if (sellStatus == "rejected") {
      setCurrentSell(sellRejected);
    } else if (sellStatus == "completed") {
      setCurrentSell(sellCompleted);
    }
  }, [sellStatus, sellActive, sellInactive, sellCompleted]);

  const handlePurchaseStatusChange = (event) => {
    setPurchaseStatus(event.target.value);
  };

  const handleSellStatusChange = (event) => {
    setSellStatus(event.target.value);
  };

  const [clearPostBuy] = useMutation(CLEAR_POST_BUY, {
    // refetchQueries: [
    //   {
    //     query: GET_PRODUCTS_BY_SELLER,
    //     variables: { id: userData._id },
    //   },
    // ],
    onCompleted: () => {
      setPurchaseInactive([]);
    },
  });

  if (postSellerLoading || postBuyerLoading) {
    return <p>Loading</p>;
  } else if (postSellerError || postBuyerError) {
    return <p>Something went wrong</p>;
  } else {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{ display: "flex", mb: 3, justifyContent: "space-between" }}
            >
              <Typography variant="h6" component="p">
                {purchaseStatus == "completed"
                  ? "Purchased"
                  : purchaseStatus == "active"
                  ? "Looking for"
                  : purchaseStatus == "inactive"
                  ? "Retrived Purchase"
                  : purchaseStatus == "pending"
                  ? "Pending Confirmation from seller"
                  : "Your offer was rejected"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {purchaseStatus == "inactive" && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      clearPostBuy({ variables: { _id: userData._id } });
                    }}
                  >
                    Clear all
                  </Button>
                )}
                <FormControl sx={{ ml: 3, minWidth: 120 }} size="small">
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
                    <MenuItem value={"pending"}>Pending</MenuItem>
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
                    <PostCard postData={purchase} />
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
                  ? "You are a candidate seller"
                  : sellStatus == "inactive"
                  ? "You cannot sell these items anymore..."
                  : sellStatus == "pending"
                  ? "Waiting for your confirmatioin"
                  : sellStatus == "in progress"
                  ? "In progress with other users"
                  : "Rejected by other users, will probably be back soon"}
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
                  value={sellStatus}
                  label="Status"
                  onChange={handleSellStatusChange}
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
            <Grid container spacing={3}>
              {currentSell.length == 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body1">No Result Found</Typography>
                </Grid>
              ) : (
                currentSell.map((sell, index) => (
                  <Grid item xs={4} key={index}>
                    <PostCard key={index} postData={sell} />
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

export default PostTransactionHolder;
