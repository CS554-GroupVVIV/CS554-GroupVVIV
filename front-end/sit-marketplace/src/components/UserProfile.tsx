import { useState, useContext, useEffect } from "react";
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
import ProductTransactionHolder from "./ProductTransactionHolder.js";
import PostTransactionHolder from "./PostTransactionHolder.js";
import FavoriteHolder from "./FavoriteHolder.js";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import CommentPage from "./CommentPage.js";
import {
  Button,
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
  const [user, setUser] = useState({});

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });

  console.log(data && data.getUserById);

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

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  if (loading) {
    return <p>Loading</p>;
  } else if (error) {
    <p>Error</p>;
  } else if (data) {
    console.log(data.getUserById);
    return (
      <Grid container direction="row" height={"100vh"}>
        <Grid item sx={{ width: "25%" }} mt={8}>
          <Card
            variant="outlined"
            style={{ border: "none" }}
            sx={{ width: "100%", padding: 3, height: "100%" }}
          >
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
                    Name: {data && data.getUserById.firstname}{" "}
                    {data && data.getUserById.lastname}
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

        <Grid item xs mt={8}>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              overflow: "auto",
              height: "100%",
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
                <Tab label="Comments" />
              </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
              {productBuyer && productSeller ? (
                <ProductTransactionHolder
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
                <PostTransactionHolder
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
              <FavoriteHolder
                favorite={data.getUserById.favorite}
                favorite_post={data.getUserById.favorite_post}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <CommentPage user_id={currentUser.uid} />
            </CustomTabPanel>
          </Box>
        </Grid>
      </Grid>
    );
  }
}
