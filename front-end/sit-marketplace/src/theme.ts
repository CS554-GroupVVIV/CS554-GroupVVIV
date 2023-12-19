import { createTheme } from "@mui/material/styles";

export const lightMode = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fffafa",
    },
    text: {
      primary: "#424242",
    },
  },
  typography: {
    fontFamily: "monospace",
    button: {
      fontWeight: "bold",
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
      primary: "#fffafa",
    },
  },
  typography: {
    fontFamily: "monospace",
    button: {
      fontWeight: "bold",
    },
  },
});
