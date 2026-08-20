import { createTheme } from "@mui/material/styles";

import colors from "./colors";
import typography from "./typography";

const theme = createTheme({

  palette: {

    mode: "light",

    primary: {
      main: colors.primary,
    },

    secondary: {
      main: colors.secondary,
    },

    success: {
      main: colors.success,
    },

    warning: {
      main: colors.warning,
    },

    error: {
      main: colors.error,
    },

    info: {
      main: colors.info,
    },

    background: {
      default: colors.background,
      paper: colors.paper,
    },

    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },

  },

  typography,

  shape: {
    borderRadius: 14,
  },

  components: {

    MuiButton: {

      styleOverrides: {

        root: {

          borderRadius: 10,

          padding: "10px 22px",

          fontWeight: 600,

          boxShadow: "none",

          "&:hover": {
            boxShadow: "0 8px 18px rgba(0,0,0,.15)",
          },

        },

      },

    },

    MuiCard: {

      styleOverrides: {

        root: {

          borderRadius: 18,

          boxShadow: "0 8px 24px rgba(0,0,0,.08)",

        },

      },

    },

    MuiPaper: {

      styleOverrides: {

        root: {

          borderRadius: 16,

        },

      },

    },

    MuiTextField: {

      defaultProps: {

        variant: "outlined",

        fullWidth: true,

      },

    },

  },

});

export default theme;