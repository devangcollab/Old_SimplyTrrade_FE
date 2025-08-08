import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
  InputAdornment,
  CardMedia,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import DeleteDialog from "../components/DeleteDialog";
import { deleteAccount, getAllAccounts } from "../apis/AccountApi";
import image from "../assets/Rectangle 1900.png";
import noDataImage from "../assets/Group 18992.png";
import { formatINR } from "../utils/utils";

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const callApi = async () => {
    const response = await getAllAccounts(search);
    setAccounts(response.data.data);
  };

  useEffect(() => {
    callApi();
  }, [search]);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setAccountId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDeleteOpen(false);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    await deleteAccount(accountId);
    navigate("/accountPage");
    setDeleteOpen(false);
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          BANK ACCOUNTS
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            value={search}
            onChange={handleSearch}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6c5ce7" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            sx={{
              color: "#6c5ce7",
              borderColor: "#6c5ce7",
              textTransform: "none",
            }}
            component={Link}
            to="/accountForm"
          >
            Add Account
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {accounts.length > 0 ? (
          accounts.map((option, index) => {
            return (
              <>
                <Card
                  sx={{
                    width: 230,
                    borderRadius: 2,
                    boxShadow: 3,
                    m: 1,
                    p: 1,
                  }}
                  key={index}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt="business logo"
                  />
                  <CardContent
                    sx={{
                      position: "relative", // Ensures the menu button is positioned correctly
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* More Icon Button - Positioned at Top Right */}
                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                      <IconButton
                        size="small"
                        onClick={(event) => handleClick(event, option._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Branch Name */}

                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {option.branchName.branchName}
                    </Typography>

                    {/* accounts Name */}
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        display="inline"
                        sx={{
                          fontSize: "1rem",
                        }}
                      >
                        Acc. Name:
                      </Typography>
                      <Typography
                        variant="body2"
                        display="inline"
                        sx={{
                          fontSize: "1rem",
                        }}
                      >
                        {option.accountName}
                      </Typography>
                    </Box>

                    {/* accounts Balance */}
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        display="inline"
                        sx={{
                          color: option.balance > 0 ? "Green" : "Red",
                          fontSize: "1rem",
                        }}
                      >
                        Balance:
                      </Typography>
                      <Typography
                        variant="body2"
                        display="inline"
                        sx={{
                          paddingLeft: "0.5rem",
                          color: option.balance > 0 ? "Green" : "Red",
                          fontSize: "1rem",
                        }}
                      >
                        {formatINR(option.balance)}
                      </Typography>
                    </Box>

                    {/* Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      sx={{ padding: 0 }}
                    >
                      <MenuItem
                        sx={{ p: 0 }}
                        onClick={() => navigate(`/accountForm/${accountId}`)}
                      >
                        <EditIcon sx={{ mr: 1, p: 0, m: 0, color: "green" }} />
                      </MenuItem>
                      <MenuItem
                        onClick={() => openDeleteDialog()}
                        sx={{ color: "red", p: 0 }}
                      >
                        <DeleteIcon sx={{ mr: 1, color: "red", p: 0, m: 0 }} />
                      </MenuItem>
                    </Menu>
                  </CardContent>
                </Card>
                <DeleteDialog
                  deleteOpen={deleteOpen}
                  handleClose={handleClose}
                  handleDelete={handleDelete}
                  closeDeleteDialog={closeDeleteDialog}
                />
              </>
            );
          })
        ) : (
          <Box
            sx={{
              margin: "auto",
            }}
          >
            <img src={noDataImage} alt="No Data Found" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AccountPage;
