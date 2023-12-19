import { useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  GET_USER,
  GET_PRODUCTS_BY_BUYER,
  GET_PRODUCTS_BY_SELLER,
  GET_POSTS_BY_SELLER,
  GET_POSTS_BY_BUYER,
} from "../queries";
import UserInfo from "./UserInfo";
import TransactionHolder from "./TransactionHolder.js";
import FavoriteHolder from "./FavoriteHolder.js";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import {
  Button,
  CssBaseline,
  Box,
  Grid,
  Tab,
  Typography,
  Tabs,
  CardHeader,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";

const drawerWidth = 300;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

export default function Dashboard() {
  let { currentUser } = useContext(AuthContext);

  const [value, setValue] = useState(0);
  const [toogleUpdateUser, setToggleUpdateUser] = useState<boolean>(false);

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  const {
    data: productSeller,
    loading: productSellerLoading,
    error: productSellerError,
  } = useQuery(GET_PRODUCTS_BY_SELLER, {
    variables: { id: currentUser ? currentUser.uid : "" },
  });

  const {
    data: productBuyer,
    loading: productBuyerLoading,
    error: productBuyerError,
  } = useQuery(GET_PRODUCTS_BY_BUYER, {
    variables: { id: currentUser ? currentUser.uid : "" },
  });

  const {
    data: postSeller,
    loading: postSellerLoading,
    error: postSellerError,
  } = useQuery(GET_POSTS_BY_SELLER, {
    variables: { _id: currentUser ? currentUser.uid : "" },
  });

  const {
    data: postBuyer,
    loading: postBuyerLoading,
    error: postBuyerError,
  } = useQuery(GET_POSTS_BY_BUYER, {
    variables: { _id: currentUser ? currentUser.uid : "" },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Box>{children}</Box>
          </Box>
        )}
      </div>
    );
  }

  if (loading) {
    return <p>Loading</p>;
  } else if (error) {
    <p>Error</p>;
  } else if (data)
    return (
      <Box sx={{ mt: 8, display: "flex" }}>
        <CssBaseline />
        <Drawer variant="permanent" open={true}>
          <Grid sx={{ mx: 1 }}>
            <Card variant="outlined" style={{ border: "none" }}>
              <CardHeader
                title={`${"User Profile"}`}
                titleTypographyProps={{ align: "center" }}
                subheaderTypographyProps={{
                  align: "center",
                }}
              />
              <CardContent>
                {toogleUpdateUser ? (
                  <UserInfo data={data} />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component="p" variant="subtitle2">
                      Id: {data && data.getUserById._id}
                    </Typography>
                    <Typography component="p" variant="subtitle2">
                      Name:{" "}
                      {data &&
                        data.getUserById.firstname + " " + data &&
                        data.getUserById.lastname}
                    </Typography>
                    <Typography component="p" variant="subtitle2">
                      Email: {data && data.getUserById.email}
                    </Typography>
                    <Typography component="p" variant="subtitle2">
                      Rating: {data && data.getUserById.rating?.toFixed(2)} from{" "}
                      {data && data.getUserById.comments?.length} users
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setToggleUpdateUser(!toogleUpdateUser);
                  }}
                >
                  {toogleUpdateUser ? "Cancel" : "Edit Profile"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Product" />
              <Tab label="Post" />
              <Tab label="Favorite" />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            {productBuyer && productSeller ? (
              <TransactionHolder
                type="product"
                purchaseData={productBuyer.getProductByBuyer}
                soldData={productSeller.getProductBySeller}
              />
            ) : productBuyerLoading && productSellerLoading ? (
              <p>Loading</p>
            ) : (
              <p>Error</p>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {postBuyer && postSeller ? (
              <TransactionHolder
                type="post"
                purchaseData={postBuyer.getPostByBuyer}
                soldData={postSeller.getPostBySeller}
              />
            ) : postBuyerLoading && postSellerLoading ? (
              <p>Loading</p>
            ) : (
              <p>Error</p>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <FavoriteHolder favorite={data.getUserById.favorite} />
          </CustomTabPanel>
        </Box>
      </Box>
    );
}
