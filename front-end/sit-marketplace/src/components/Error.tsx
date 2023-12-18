import { Card, Container, CardContent, Grid, Link } from "@mui/material";
import { useNavigate } from "react-router";

export default function Error({ messgae }) {
  const navigate = useNavigate();
  return (
    <div>
      <Container maxWidth="lg">
        {messgae && <p>Error:{message}</p>}
        <Link onClick={() => navigate("/")}>
          <h1>Home</h1>
        </Link>
      </Container>
    </div>
  );
}
