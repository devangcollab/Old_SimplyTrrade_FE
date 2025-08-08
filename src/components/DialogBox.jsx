import React, { useState } from "react";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { deleteOrg } from "../apis/OrganizationApi";
import { deleteOrgBranch } from "../apis/OrganizationBranchApi";
import { deleteUser } from "../apis/UserApi";
import { deleteCategory } from "../apis/CategoryApi";
import { deleteModel } from "../apis/ModelApi";
import { deleteDevice } from "../apis/DeviceApi";
import { deleteColor } from "../apis/ColorApi";
import { deleteCapacity } from "../apis/CapacityApi";
import DeleteDialog from "./DeleteDialog";

const DialogBox = ({ handleClose, open, data, callApi, fieldName }) => {
  const {
    primaryAddress,
    organizationName,
    addressLine1,
    city,
    addressLine2,
    district,
    zipCode,
    state,
    country,
    telePhone,
    email,
    gstNumber,
    companyType,
    organization,
    branchName,
    name,
    orgBranch,
    categoryName,
    modelName,
    colorName,
    categoryId,
    id,
  } = data;

  const [deleteOpen, setDeleteOpen] = useState(false);

  const openDeleteDialog = () => {
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
  };

  const handleDelete = async () => {
    fieldName == "organizationForm"
      ? deleteOrg(id)
      : fieldName == "organizationBranchForm"
      ? deleteOrgBranch(id)
      : fieldName == "userForm"
      ? deleteUser(id)
      : fieldName == "categoryForm"
      ? deleteCategory(id)
      : fieldName == "modelForm"
      ? deleteModel(id)
      : fieldName == "deviceForm"
      ? deleteDevice(id)
      : fieldName == "colorForm"
      ? deleteColor(id)
      : fieldName == "capacityForm"
      ? deleteCapacity(id)
      : "";

    setDeleteOpen(false);
    handleClose();
    callApi();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#F8F8FF",
          color: "#4C2D85",
          fontWeight: "bold",
          borderBottom: "2px solid gray",
        }}
      >
        {fieldName == "organizationForm"
          ? "ORGANIZATIONS"
          : fieldName == "organizationBranchForm"
          ? "ORGANIZATIONS BRANCH"
          : fieldName == "userForm"
          ? "USER"
          : fieldName == "categoryForm"
          ? "CATEGORY"
          : fieldName == "modelForm"
          ? "MODEL"
          : fieldName == "deviceForm"
          ? "DEVICE"
          : fieldName == "colorForm"
          ? "COLOR"
          : fieldName == "capacityForm"
          ? "CAPACITY"
          : ""}
      </DialogTitle>
      <DialogContent>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          {gstNumber && (
            <Typography variant="body1">
              <b>GST IN :</b> {gstNumber}
            </Typography>
          )}
          {primaryAddress && (
            <Typography variant="body1">
              <b>Primary Address :</b> {primaryAddress}
            </Typography>
          )}
          {organizationName && (
            <Typography variant="body1">
              <b>Organization Name :</b> {organizationName}
            </Typography>
          )}
          {colorName && (
            <Typography variant="body1">
              <b>Color Name :</b> {colorName}
            </Typography>
          )}
          {branchName && (
            <Typography variant="body1">
              <b>BranchName :</b>{" "}
              {branchName?.branchName ? branchName?.branchName : branchName}
            </Typography>
          )}

          {categoryId && (
            <Typography variant="body1">
              <b>Category Name :</b> {categoryId && categoryId?.categoryName}
            </Typography>
          )}
          {addressLine1 && (
            <Typography variant="body1">
              <b>Address Line 1 :</b> {addressLine1}
            </Typography>
          )}
          {city && (
            <Typography variant="body1">
              <b>City :</b>
              {city}
            </Typography>
          )}
          {addressLine2 && (
            <Typography variant="body1">
              <b>Address Line 2 :</b> {addressLine2}
            </Typography>
          )}
          {district && (
            <Typography variant="body1">
              <b>District :</b>
              {district}
            </Typography>
          )}
          {zipCode && (
            <Typography variant="body1">
              <b>Zip Code :</b> {zipCode}
            </Typography>
          )}
          {state && (
            <Typography variant="body1">
              <b>State :</b> {state}
            </Typography>
          )}
          {telePhone && (
            <Typography variant="body1">
              <b>Tele Phone :</b> {telePhone}
            </Typography>
          )}
          {country && (
            <Typography variant="body1">
              <b>Country :</b>
              {country}
            </Typography>
          )}
          {email && (
            <Typography variant="body1">
              <b>Email :</b>
              {email}
            </Typography>
          )}
          {companyType && (
            <Typography variant="body1">
              <b>Company Reg. Type :</b> {companyType}
            </Typography>
          )}
          {organization && (
            <Typography variant="body1">
              <b>Organization :</b>{" "}
              {(organization && organization) || organization.organizationName}
            </Typography>
          )}
          {orgBranch && (
            <Typography variant="body1">
              <b>Organization Branch :</b> {orgBranch && orgBranch.branchName}
            </Typography>
          )}
          {name && (
            <Typography variant="body1">
              <b>Name :</b> {name}
            </Typography>
          )}
          {categoryName && (
            <Typography variant="body1">
              <b>Category Name :</b> {categoryName}
            </Typography>
          )}
          {modelName && (
            <Typography variant="body1">
              <b>Model Name :</b> {modelName}
            </Typography>
          )}

          {fieldName == "userForm" ||
          fieldName == "categoryForm" ||
          fieldName == "modelForm" ? (
            ""
          ) : (
            <>
              <Typography variant="body1">
                <b>Dealing Currency :</b> Rupee's
              </Typography>
              <Typography variant="body1">
                <b>Financial Year :</b> 2024
              </Typography>
              <Typography variant="body1">
                <b>Default Stock Method :</b> mithilshah12@gmail.com
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Link
          to={
            fieldName == "organizationForm"
              ? `/organizationForm/${id}`
              : fieldName == "userForm"
              ? `/userForm/${id}`
              : fieldName == "categoryForm"
              ? `/categoryForm/${id}`
              : fieldName == "modelForm"
              ? `/modelForm/${id}`
              : fieldName == "deviceForm"
              ? `/deviceForm/${id}`
              : fieldName == "colorForm"
              ? `/colorForm/${id}`
              : fieldName == "capacityForm"
              ? `/capacityForm/${id}`
              : `/organizationBranchForm/${id}`
          }
        >
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
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
