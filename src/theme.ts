import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

// FinQuest Material theme — M3 expressive, finance-green seed.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1B7A43", // deep market green
      light: "#57A773",
      dark: "#0F5132",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#B7791F", // gold for XP / rewards
      light: "#D9A441",
      dark: "#7A5210",
      contrastText: "#FFFFFF",
    },
    tertiary: {
      main: "#0E7490", // teal for info accents
      light: "#22A3C4",
      dark: "#0A4E63",
      contrastText: "#FFFFFF",
    },
    error: { main: "#BA1A1A" },
    background: {
      default: "#F4F7F3", // surface, hint of green
      paper: "#FFFFFF",
    },
  },
  shape: {
    borderRadius: 16, // M3 medium — cards, fields, dialogs
  },
  typography: {
    fontFamily: [
      "Roboto",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 }, // M3 buttons aren't uppercase
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 20 }, // M3 pill buttons
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: { borderRadius: 20 }, // M3 medium/large cards
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: { borderRadius: "24px 24px 0 0" },
      },
    },
  },
});

export default theme;
