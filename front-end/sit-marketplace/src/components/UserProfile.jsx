import { useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../context/AuthContext.jsx";
import { GET_USER } from "../queries";
import UserInfo from "./UserInfo";
import ProductTransactionHolder from "./ProductTransactionHolder";
import PostTransactionHolder from "./PostTransactionHolder.jsx";
import FavoriteHolder from "./FavoriteHolder.jsx";
import CommentPage from "./CommentPage.jsx";
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
import Error from "./Error.jsx";

export default function Dashboard() {
  let { currentUser } = useContext(AuthContext);

  const [value, setValue] = useState(0);
  const [toogleUpdateUser, setToggleUpdateUser] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: { id: currentUser?.uid },
    fetchPolicy: "cache-and-network",
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
    <Error statusCodeProp={500} messageProp={"Something went wrong"} />;
  } else if (data) {
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
                  {/* <Typography component="p" variant="subtitle2">
                    Id: {data && data.getUserById._id}
                  </Typography> */}
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
              <ProductTransactionHolder
                userData={data.getUserById}
                refetchUserData={refetch}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <PostTransactionHolder userData={data.getUserById} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <FavoriteHolder
                favorite_products={data.getUserById.favorite_products}
                favorite_posts={data.getUserById.favorite_posts}
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
