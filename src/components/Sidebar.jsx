import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Badge,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  Notifications,
  Settings,
  ExpandLess,
  ExpandMore,
  People,
  SupportAgent,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Group 18763.png";
import minimizedLogo from "../assets/Group 18761.png";
import SegmentIcon from "@mui/icons-material/Segment";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Inventory from "@mui/icons-material/Inventory";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import Business from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import OnDeviceTrainingIcon from "@mui/icons-material/OnDeviceTraining";
import DevicesIcon from "@mui/icons-material/Devices";
import ColorizeIcon from "@mui/icons-material/Colorize";
import StorageIcon from "@mui/icons-material/Storage";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BuildIcon from "@mui/icons-material/Build";
import Layout from "../pages/Layout";

const iconColor = "#5C4E89"; // Custom icon color
const activeColor = "#E0E0E0"; // Highlight color for selected item

const Sidebar = ({ setIsSidebarMinimized }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    setIsSidebarMinimized(newState); // pass back to Layout
  };

  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState({});
  const [isMasterVisible, setIsMasterVisible] = useState(true);

  useEffect(() => {
    // Fetch user data from local storage
    const userData = JSON.parse(localStorage.getItem("role")) || {};
    if (userData.isLoggedIn || userData.role === "user") {
      setIsMasterVisible(false);
    }
  }, []);

  const handleToggle = (label) => {
    setOpenMenu((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <Dashboard sx={{ color: iconColor }} />,
    },
    ...(isMasterVisible
      ? [
          {
            label: "Master",
            icon: <People sx={{ color: iconColor }} />,
            subMenu: [
              {
                path: "/organizationPage",
                label: "Organization",
                icon: <Business sx={{ color: iconColor }} />,
              },
              {
                path: "/organizationBranchPage",
                label: "Org. Branch",
                icon: <Business sx={{ color: iconColor }} />,
              },
              {
                path: "/category",
                label: "Category",
                icon: <CategoryIcon sx={{ color: iconColor }} />,
              },
              {
                path: "/modelPage",
                label: "Model",
                icon: <OnDeviceTrainingIcon sx={{ color: iconColor }} />,
              },
              {
                path: "/devicePage",
                label: "Device",
                icon: <DevicesIcon sx={{ color: iconColor }} />,
              },
              {
                path: "/colorPage",
                label: "Color",
                icon: <ColorizeIcon sx={{ color: iconColor }} />,
              },
              {
                path: "/capacityPage",
                label: "Capacity",
                icon: <StorageIcon sx={{ color: iconColor }} />,
              },
              {
                path: "/userPage",
                label: "Users",
                icon: <PeopleAltIcon sx={{ color: iconColor }} />,
              },
            ],
          },
        ]
      : []),
    {
      path: "/accountPage",
      label: "Account",
      icon: <AccountCircleRoundedIcon sx={{ color: iconColor }} />,
    },
    {
      path: "/stockPage",
      label: "Stock",
      icon: <Inventory sx={{ color: iconColor }} />,
    },
    {
      path: "/sellPage",
      label: "Sell Devices",
      icon: <MobileFriendlyIcon sx={{ color: iconColor }} />,
    },
    {
      label: "Report",
      icon: <ArticleIcon sx={{ color: iconColor }} />,
      subMenu: [
        {
          path: "/customerPage",
          label: "Customer",
          icon: <PersonIcon sx={{ color: iconColor }} />,
        },
        {
          path: "/expensePage",
          label: "Expense",
          icon: <AccountBalanceWalletIcon sx={{ color: iconColor }} />,
        },
        {
          path: "/customerLedgerPage",
          label: "Customer Ledger",
          icon: <MenuBookIcon sx={{ color: iconColor }} />,
        },
        {
          path: "/plTable",
          label: "Profit & Loss",
          icon: <AssessmentIcon sx={{ color: iconColor }} />,
        },
      ],
    },
    // {
    //   path: "/repairPage",
    //   label: "Repair",
    //   icon: <BuildIcon sx={{ color: iconColor }} />,
    // },
  ];
  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isMinimized ? 100 : 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMinimized ? 100 : 240,
          boxSizing: "border-box",
          background: "#ffffff",
          color: iconColor,
          height: "100vh",
          overflowX: "auto",
          scrollbarGutter: "none",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.5s",
          overflowY: "auto", // still allow vertical scroll if needed
        },
      }}
    >
      {/* fixed header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          py: 2,
          px: isMinimized ? 1 : 2,
          position: "sticky",
          top: 0,
          background: "#ffffff",
          zIndex: 1000,
        }}
      >
        {isMinimized ? (
          <img
            src={minimizedLogo} // Replace with the path to your minimized logo
            alt="Minimized Logo"
            style={{ width: 40, cursor: "pointer" }} // Adjust size as needed
            onClick={() => navigate("/dashboard")}
          />
        ) : (
          <img
            src={logo} // Replace with the path to your normal logo
            alt="Logo"
            style={{ width: 160, cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          />
        )}
        <SegmentIcon
          sx={{
            height: 30,
            width: 30,
            borderRadius: 50,
            padding: 0.4,
            cursor: "pointer",
          }}
          onClick={toggleSidebar}
        />
      </Box>

      {/* Scrollable Menu Items */}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <List>
          {menuItems.map((item) =>
            item.subMenu ? (
              <React.Fragment key={item.label}>
                <ListItemButton
                  onClick={() => handleToggle(item.label)}
                  sx={{
                    justifyContent: isMinimized ? "center" : "flex-start",
                  }}
                >
                  <Tooltip title={isMinimized && item.label}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                  </Tooltip>
                  {!isMinimized && <ListItemText primary={item.label} />}
                  {openMenu[item.label] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                {isMinimized ? (
                  // Submenu directly below in minimized state
                  openMenu[item.label] && (
                    <Box sx={{ pl: 2 }}>
                      {item.subMenu.map((subItem) => (
                        <ListItemButton
                          key={subItem.label}
                          sx={{
                            justifyContent: "center",
                            backgroundColor: isActive(subItem.path)
                              ? activeColor
                              : "transparent",
                          }}
                          onClick={() => {
                            if (isActive(subItem.path)) {
                              toggleSidebar();
                            } else {
                              navigate(subItem.path);
                            }
                          }}
                        >
                          <Tooltip title={isMinimized && subItem.label}>
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                          </Tooltip>
                        </ListItemButton>
                      ))}
                    </Box>
                  )
                ) : (
                  <Collapse
                    in={openMenu[item.label]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subMenu.map((subItem) => (
                        <ListItemButton
                          key={subItem.label}
                          sx={{
                            pl: 4,
                            backgroundColor: isActive(subItem.path)
                              ? activeColor
                              : "transparent",
                          }}
                          onClick={() => {
                            if (isActive(subItem.path)) {
                              toggleSidebar();
                            } else {
                              navigate(subItem.path);
                            }
                          }}
                        >
                          <Tooltip title={isMinimized && subItem.label}>
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                          </Tooltip>
                          <ListItemText primary={subItem.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ) : (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  if (isActive(item.path)) {
                    toggleSidebar();
                  } else {
                    navigate(item.path);
                  }
                }}
                sx={{
                  backgroundColor: isActive(item.path)
                    ? activeColor
                    : "transparent",
                  "&:hover": { backgroundColor: activeColor },
                }}
              >
                <Tooltip title={isMinimized && item.label}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                </Tooltip>
                {!isMinimized && <ListItemText primary={item.label} />}
              </ListItemButton>
            )
          )}
        </List>
      </Box>

      {/* Fixed Footer */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: isMinimized ? 1 : 2, // Adjust padding based on sidebar state
          background: "#ffffff",
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <ListItemButton
          sx={{
            justifyContent: isMinimized ? "center" : "flex-start",
          }}
        >
          <ListItemIcon>
            <Badge color="primary">
              <Notifications sx={{ color: iconColor }} />
            </Badge>
          </ListItemIcon>
          {!isMinimized && <ListItemText primary="Notification" />}
        </ListItemButton>

        <ListItemButton
          sx={{
            justifyContent: isMinimized ? "center" : "flex-start",
          }}
        >
          <ListItemIcon>
            <SupportAgent sx={{ color: iconColor }} />
          </ListItemIcon>
          {!isMinimized && <ListItemText primary="Support" />}
        </ListItemButton>

        <ListItemButton
          sx={{
            justifyContent: isMinimized ? "center" : "flex-start",
          }}
        >
          <ListItemIcon>
            <Settings sx={{ color: iconColor }} />
          </ListItemIcon>
          {!isMinimized && <ListItemText primary="Settings" />}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
