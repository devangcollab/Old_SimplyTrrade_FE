import React from "react";
import errorImage from "../assets/404-error-page.avif";
import { Box } from "@mui/material";

const NotFound404 = () => {
  return (
    <Box display="flex" justifyContent="center" marginTop="6rem">
      <img src={errorImage} alt="errorImage" />
    </Box>
  );
};

export default NotFound404;
