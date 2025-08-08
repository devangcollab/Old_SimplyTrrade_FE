import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Avatar,
  List,
  ListItem,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import userImage from "../assets/Ellipse 2332.png";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { Business, Logout } from "@mui/icons-material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

const Header = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const api_call = import.meta.env.VITE_API_URL;

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${api_call}/findUser`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data.data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);

  const formattedDate = moment().format("DD MMM. YYYY");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchLogOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${api_call}/createActivityLog`,
        { message: "logout" }, // Request body (empty if you're not sending any data)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      } else {
        console.log("Error logging out");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = async () => {
    await fetchLogOut();
    navigate("/signIn");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        color: "black",
        boxShadow: 1,
        paddingX: 2,
        zIndex: 1100, // Ensures it stays above other elements
        top: 0,
        width: "100%",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
        <Box display="flex" alignItems="center" gap={2}>
          {userData.organization?.organizationName && (
            <>
              <Typography>
                Organization : {userData.organization?.organizationName}
              </Typography>
              <Typography>
                Branch Name : {userData.orgBranch?.branchName}
              </Typography>
            </>
          )}
          <IconButton
            color="inherit"
            sx={{ border: "1px solid #ddd", borderRadius: "50%" }}
          >
            <NotificationsIcon sx={{ color: "#5C4E89" }} />
          </IconButton>
          <Button
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderColor: "#5C4E89",
              color: "#6c5ce7",
              textTransform: "none",
            }}
          >
            <CalendarMonthIcon sx={{ color: "#5C4E89" }} />
            {formattedDate}
          </Button>

          <Button
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              borderColor: "#ddd",
              color: "black",
              textTransform: "none",
              padding: "5px 10px",
            }}
            onClick={handleClick}
          >
            <Box>
              <Typography variant="body2">Welcome</Typography>
              <Typography variant="body2" fontWeight="bold" color="#5C4E89">
                {userData.name}!
              </Typography>
            </Box>
            <Avatar src={userImage} sx={{ width: 32, height: 32 }} />
          </Button>

          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-end"
            disablePortal
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Paper sx={{ mt: 1, borderRadius: 2, boxShadow: 3 }}>
                <List>
                  <ListItem button onClick={() => navigate("/activityLog")}>
                    <AccountCircleRoundedIcon>
                      <Business sx={{ color: "primary" }} />
                    </AccountCircleRoundedIcon>
                    Activity Logs
                  </ListItem>
                  <ListItem onClick={handleLogout} button>
                    <LogoutIcon>
                      <Logout sx={{ color: "primary" }} />
                    </LogoutIcon>
                    Logout
                  </ListItem>
                </List>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

// Ensure the main content has a top margin equal to AppBar's height
export const headerHeight = 64;
