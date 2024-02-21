import React from 'react';
import ReactDOM from 'react-dom/client';
import AssertAccount from './AssertAccount';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {ApiProvider} from "./hooks/ApiContext";
import {SnackbarProvider} from "notistack";

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff7b42"
    },
    secondary: {
      main: "#516340"
    },
  },
});

root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <CssBaseline/>
          <ApiProvider>
          <SnackbarProvider>
            <AssertAccount/>
          </SnackbarProvider>
          </ApiProvider>
      </ThemeProvider>
  </React.StrictMode>
);
