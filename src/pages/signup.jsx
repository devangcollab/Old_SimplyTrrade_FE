import React from "react";
import { Box, Grid } from "@mui/material";
import sideImage from "../assets/Group 18754.png";
import Logo from "../components/Logo";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <Box sx={{ flexGrow: 1, height: "100vh" }}>
      <Grid container spacing={2}>
        {/* Left Section: Logo and Signup Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Logo />
          <SignupForm />
        </Grid>

        {/* Right Section: Illustration (Hidden on mobile) */}
        <Grid
          item
          xs={0}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" }, // Hide on xs, show on md and up
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <img
            src={sideImage}
            alt="Illustration"
            style={{
              marginLeft: "5.2rem",
              height: "100vh",
              width: "89%",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupPage;
