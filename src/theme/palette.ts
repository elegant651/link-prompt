import { PaletteOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    green: string;
    blue: string;
    blueLight: string;
    red: string;
    orange: string;
    yellow: string;
    purpleLight: string;
    purpleDark: string;
    greyLight: string;
    greyDark: string;
  }
}

export const palette: PaletteOptions = {
  primary: {
    main: "#32a8a0",
  },
  secondary: {
    main: "#328ca8",
  },
  success: {
    main: "#1DB954",
  },
  error: {
    main: "#FF4400",
  },
  divider: "#cccccc",
  green: "#1DB954",
  blue: "#2B6EFD",
  blueLight: "#00ADEF",
  red: "#FF4400",
  orange: "#E97E27",
  yellow: "#FFC833",
  purpleLight: "#9747FF",
  purpleDark: "#410C92",
  greyLight: "#999999",
  greyDark: "#333333",
};
