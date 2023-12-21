import { Container, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router";

export default function Error({ messageProp, statusCodeProp }) {
  // const location = useLocation();
  const navigate = useNavigate();
  // const { message: locationMessage, statusCode: locationStatusCode } =
  //   location.state || {};

  // Use props if they exist, otherwise use location state
  // const message = messageProp || locationMessage;
  // const statusCode = statusCodeProp || locationStatusCode;
  const message = messageProp;
  const statusCode = statusCodeProp;

  let errorMessage;
  switch (statusCode) {
    case 400:
      errorMessage = "Bad Request";
      break;
    case 404:
      errorMessage = `Not Found`;
      break;
    default:
      errorMessage = message;
      break;
  }

  return (
    <div>
      <Container maxWidth="lg" sx={{ marginTop: 10 }}>
        <h1>Error {statusCode}</h1>
        <p>{errorMessage}</p>
        <Link onClick={() => navigate("/")}>Go back to homepage</Link>
      </Container>
    </div>
  );
}
