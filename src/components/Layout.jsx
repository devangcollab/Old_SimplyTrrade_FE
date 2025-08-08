import React from "react";
import { Container, Grid } from "@mui/material";

const Layout = ({ left, right }) => {
  return (
    <Container
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {left}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          {right}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Layout;
