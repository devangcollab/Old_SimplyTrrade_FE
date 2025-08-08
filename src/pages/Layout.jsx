import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Layout = ({ children }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  return (
    <Box sx={{ display: "flex", marginTop: "4rem" }}>
      <Sidebar setIsSidebarMinimized={setIsSidebarMinimized} />
      <Box
        sx={{
          // marginLeft: isSidebarMinimized ? "100px" : "240px",
          transition: "margin-left 0.3s ease",
          width: `calc(100% - ${isSidebarMinimized ? "100px" : "240px"})`,
        }}
      >
        <Header />
        <Box
          sx={{
            padding: 3,
            height: "93vh",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
