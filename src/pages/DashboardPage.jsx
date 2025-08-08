import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { allSellStockRepair } from "../apis/SellApi";
import { formatINR } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { getProfitLoss } from "../apis/ProfitLossApi";

const DashboardPage = () => {
  const [loggedUserData, setLoggedUserData] = useState({});

  const [stockTotals, setStockTotals] = useState([]);
  const [sellTotals, setSellTotals] = useState([]);
  useEffect(() => {
    const userData = localStorage.getItem("role");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setLoggedUserData(parsedData || {});
    }
  }, []);

  const [overAllData, setOverAllData] = useState({});

  const callApiExpense = async () => {
    try {
      const response = await getProfitLoss(); // +1 because API uses 1-based indexing
      console.log("response", response);
      setOverAllData(response.data.overall);
    } catch (error) {
      console.error("Error fetching organization branch data:", error);
    }
  };

  const navigate = useNavigate();

  const callApi = async () => {
    try {
      const response = await allSellStockRepair();
      console.log("response", response);

      setStockTotals(response.data.stockTotals);
      setSellTotals(response.data.sellTotals);
    } catch (error) {
      console.error("Error fetching organization branch data:", error);
    }
  };

  useEffect(() => {
    callApi();
    callApiExpense();
  }, []);

  return (
    <Grid container spacing={2}>
      {/* First Card */}
      <Grid item xs={12} sm={6} md={3} onClick={() => navigate("/stockPage")} sx={{cursor : "pointer"}} >
        <Box
          sx={{
            backgroundColor: "#AFF2D2",
            borderRadius: 2,
            p: 2,
            height: 120,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Icon */}
          <Box
            sx={{
              position: "absolute",
              right: 8,
              fontSize: 100,
              color: "rgba(0, 128, 0, 0.1)",
            }}
          >
            <ShoppingCartIcon fontSize="inherit" />
          </Box>

          {/* Foreground Icon & Amount */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <ShoppingCartIcon sx={{ color: "green", fontSize: 30 }} />
            <Typography
              variant="h6"
              sx={{ color: "green", fontWeight: "bold", marginTop: 2 }}
            >
              Stock : {formatINR(stockTotals.totalAmount)}
            </Typography>
          </Box>
        </Box>
      </Grid>
      {/* second card */}
      <Grid item xs={12} sm={6} md={3} onClick={() => navigate("/sellPage")} sx={{cursor : "pointer"}}>
        <Box
          sx={{
            backgroundColor: "#F2AFB0",
            borderRadius: 2,
            p: 2,
            height: 120,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Icon */}
          <Box
            sx={{
              position: "absolute",
              right: 8,
              fontSize: 100,
              color: "rgba(205, 87, 69, 0.1)",
            }}
          >
            <StorefrontRoundedIcon fontSize="inherit" />
          </Box>

          {/* Foreground Icon & Amount */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <StorefrontRoundedIcon sx={{ color: "#EF6F71", fontSize: 30 }} />
            <Typography
              variant="h6"
              sx={{ color: "#EF6F71", fontWeight: "bold", marginTop: 2 }}
            >
              Sell : {formatINR(sellTotals.totalAmount)}
            </Typography>
          </Box>
        </Box>
      </Grid>
      {/* Third Card */}
      <Grid item xs={12} sm={6} md={3} onClick={() => navigate("/expensePage")} sx={{cursor : "pointer"}}>
        <Box
          sx={{
            backgroundColor: "#CCEFF8",
            borderRadius: 2,
            p: 2,
            height: 120,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Icon */}
          <Box
            sx={{
              position: "absolute",
              right: 8,
              fontSize: 100,
              color: "rgba(29, 133, 224, 0.1)",
            }}
          >
            <AccountBalanceWalletIcon fontSize="inherit" />
          </Box>

          {/* Foreground Icon & Amount */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <AccountBalanceWalletIcon sx={{ color: "#3FD8FF", fontSize: 30 }} />
            <Typography
              variant="h6"
              sx={{ color: "#3FD8FF", fontWeight: "bold", marginTop: 2 }}
            >
              Expense :{" "}
              {formatINR(
                overAllData.totalExpense + overAllData.totalGeneralExpense
              )}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
