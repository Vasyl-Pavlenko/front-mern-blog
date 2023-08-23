import React from "react";
import { Paper, Typography, ThemeProvider, createTheme } from "@mui/material";
import styles from "./SideBlock.module.scss";

const theme = createTheme();

export const SideBlock = ({ title, children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={2}
        classes={{ root: styles.root }}
      >
        <Typography
          variant="h6"
          classes={{ root: styles.title }}
        >
          {title}
        </Typography>
        
        {children}
      </Paper>
    </ThemeProvider>
  );
};