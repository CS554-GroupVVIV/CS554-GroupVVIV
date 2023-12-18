import { createTheme } from "@mui/material/styles";

export const lightMode = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "snow",
    },
    text: {
      primary: "#424242",
    },
  },
});

export const darkMode = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#424242",
    },
    text: {
      primary: "snow",
    },
  },
});