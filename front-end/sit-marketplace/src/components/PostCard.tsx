import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { socketID, socket } from "./socket";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
  Link,
  Button,
  IconButton,
} from "@mui/material";

import {
  ADD_FAVORITE_TO_USER,
  REMOVE_FAVORITE_FROM_USER,
  ADD_POSSIBLE_BUYER,
  GET_USERS_BY_IDS,
  GET_USER_FOR_FAVORITE,
} from "../queries";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../queries";

export default function PostCard({ postData }) {
  const [id, setId] = useState(undefined);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [hasFavorited, setHasFavorited] = useState(false);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_FOR_FAVORITE, {
    variables: { id: currentUser ? currentUser.uid : "" },
    fetchPolicy: "cache-and-network",
  });
  const [removeFavorite, { removeData, removeLoading, removeError }] =
    useMutation(REMOVE_FAVORITE_FROM_USER, {
      refetchQueries: [GET_USER, "getUserById"],
    });

  const [addFavorite, { addData, addLoading, addError }] = useMutation(
    ADD_FAVORITE_TO_USER,
    {
      refetchQueries: [
        {
          query: GET_USER,
          variables: { _id: currentUser ? currentUser.uid : "" },
        },
      ],
    }
  );

  useEffect(() => {
    if (!userLoading) {
      if (userData?.getUserById?.favorite?.includes(postData._id)) {
        setHasFavorited(true);
      } else {
        setHasFavorited(false);
      }
    }
  }, [userLoading, userData, userError]);

  function handleFavorite() {
    try {
      if (!currentUser || !currentUser.uid) {
        alert("You need to login to favorite this product!");
        return;
      }
      if (hasFavorited) {
        //it is favorite function for product. it needs to be replaced by function for post
        removeFavorite({
          variables: { id: currentUser.uid, productId: postData._id },
        });
        console.log(false);
        setHasFavorited(false);
      } else {
        //it is favorite function for product. it needs to be replaced by function for post
        addFavorite({
          variables: { id: currentUser.uid, productId: postData._id },
        });
        setHasFavorited(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <Grid item>
      <Card sx={{ width: 300, height: "100%" }}>
        <Link
          component="button"
          sx={{
            textDecoration: "none",
          }}
          onClick={() => navigate(`/post/${postData._id}`)}
        >
          <CardHeader
            titleTypographyProps={{ fontWeight: "bold" }}
            title={postData.item}
          ></CardHeader>
        </Link>

        <CardContent>
          <p>Price: {postData.price}</p>
          <p>Condition: {postData.condition}</p>

          {currentUser && (
            <>
              {postData.buyer_id !== currentUser.uid ? (
                <>
                  {" "}
                  <Button
                    size="small"
                    variant="contained"
                    color="inherit"
                    onClick={() => {
                      if (currentUser.uid) {
                        socket.emit("join room", {
                          room: postData.buyer_id,
                          user: currentUser.uid,
                        });
                      }
                    }}
                  >
                    Chat with buyer
                  </Button>
                  <IconButton sx={{ marginLeft: 3 }} onClick={handleFavorite}>
                    {hasFavorited ? (
                      <FavoriteIcon sx={{ color: "#e91e63" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
