import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./index.css";

import App from "./App";
import theme from "./theme/theme";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <App />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          theme="colored"
        />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);