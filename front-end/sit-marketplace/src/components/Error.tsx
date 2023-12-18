import { Container, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router";

export default function Error() {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, statusCode } = location.state;
  console.log("message", message);
  console.log("statusCode", statusCode);
  let errorMessage;
  switch (statusCode) {
    case 400:
      errorMessage = "Bad Request";
      break;
    case 404:
      errorMessage = `${message} not found`;
      break;
    default:
      errorMessage = message;
      break;
  }

  return (
    <div>
      <Container maxWidth="lg">
        <h1>Error {statusCode}</h1>
        <p>{errorMessage}</p>
        <Link onClick={() => navigate("/")}>
          <h1>Home</h1>
        </Link>
      </Container>
    </div>
  );
}
