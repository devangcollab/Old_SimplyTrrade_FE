import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  Card,
  Avatar,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Link } from "react-router-dom";
import { deleteStock } from "../apis/StockApi";
import DeleteDialog from "./DeleteDialog";
import image from "../assets/iphone.webp";

const StockDialog = ({ open, handleClose, data, fieldName }) => {
  const {
    _id,
    organization,
    branch,
    customerName,
    customerPhone,
    categoryName,
    modelName,
    deviceName,
    capacityName,
    color,
    payment,
    imeiNo,
    totalAmount,
    remainingAmount,
    id,
  } = data;

  const [deleteOpen, setDeleteOpen] = useState(false);

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    fieldName == "stockForm" ? deleteStock(_id) : "";
    setDeleteOpen(false);
    handleClose();
  };

  return (
    <Dialog open={open} handleClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: "#EEE", fontWeight: "bold" }}>
        STOCK
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Organization & Customer Details */}
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={6}>
            {organization && (
              <Typography>
                <strong>Organization:</strong>{" "}
                {organization && organization.organizationName}
              </Typography>
            )}

            {customerName && (
              <Typography>
                <strong>Customer Name:</strong> {customerName?.customerName}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            {branch && (
              <Typography>
                <strong>Branch:</strong>
                {branch && branch.branchName}
              </Typography>
            )}
            {customerPhone && (
              <Typography>
                <strong>Customer Phone:</strong>
                {customerPhone}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Device Details */}
        <Card sx={{ my: 2, p: 2 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <PhoneAndroidIcon sx={{ mr: 1 }} /> Device Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Avatar
                variant="rounded"
                sx={{ width: "100%", height: "auto" }}
                src={image}
                alt="Device Image"
              />
            </Grid>
            <Grid item xs={9}>
              {categoryName && (
                <Typography>
                  <strong>Category:</strong>
                  {categoryName && categoryName.categoryName}
                </Typography>
              )}
              {modelName && (
                <Typography>
                  <strong>Model:</strong> {modelName && modelName.modelName}
                </Typography>
              )}

              {deviceName && (
                <Typography>
                  <strong>Device:</strong> {deviceName && deviceName.deviceName}
                </Typography>
              )}
              {capacityName && (
                <Typography>
                  <strong>Capacity:</strong>{" "}
                  {capacityName && capacityName.capacityName}
                </Typography>
              )}
              {color && (
                <Typography>
                  <strong>Color:</strong>
                  {color && color.colorName}
                </Typography>
              )}
              {imeiNo && (
                <Typography>
                  <strong>IMEI No.:</strong> {imeiNo}
                </Typography>
              )}
              {totalAmount && (
                <Typography sx={{ color: "green" }}>
                  <strong>Total Amount:</strong> {totalAmount}
                </Typography>
              )}
              {remainingAmount && (
                <Typography sx={{ color: "red" }}>
                  <strong>Remaining Amount:</strong>
                  {remainingAmount}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Card>

        {/* Payment Details */}
        <Card sx={{ my: 2, p: 2 }}>
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <AccountBalanceIcon sx={{ mr: 1 }} /> Payment Details
          </Typography>
          <Typography>
            <strong>Payment Account:</strong> Sate Bank Of India
          </Typography>
          {payment && (
            <Typography sx={{ color: "red" }}>
              <strong>Payment Amount:</strong>
              {payment}
            </Typography>
          )}
        </Card>
      </DialogContent>
      <DialogActions>
        <Link to={fieldName == "stockForm" ? `/stockForm/${id}` : ""}>
          <Button variant="outlined" color="success">
            Edit
          </Button>
        </Link>
        <Button variant="outlined" color="error" onClick={openDeleteDialog}>
          Delete
        </Button>

        <DeleteDialog
          deleteOpen={deleteOpen}
          handleClose={handleClose}
          handleDelete={handleDelete}
          closeDeleteDialog={closeDeleteDialog}
        />
      </DialogActions>
    </Dialog>
  );
};

export default StockDialog;
