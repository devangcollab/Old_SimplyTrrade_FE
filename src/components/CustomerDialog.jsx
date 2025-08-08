import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../apis/CustomerApi";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import CloseIcon from "@mui/icons-material/Close";
import { errorMessage, formatMessage, lengthMessage } from "../../errorMessage";

const CustomerDialog = ({
  customerDialog,
  handleClose,
  setOpen,
  customerData,
  field,
  customerName,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    organization: null,
    branchName: null,
    customerName: "",
    customerPhone: "",
  });

  const [errors, setErrors] = React.useState({});
  const organization = customerData?.organization ?? null;
  const branchName = customerData?.branchName ?? null;
  const branchId = customerData?._id ?? null;

  React.useEffect(() => {
    if (customerData) {
      setFormData({
        organization: {
          label: organization?.organizationName,
          value: organization?._id,
        },
        branchName: { label: branchName, value: branchId },
        customerName: customerName || "",
        customerPhone: customerData.customerPhone || "",
      });
    }
  }, [customerData]);

  const [selectedOrganization, setSelectedOrganization] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStockForm = () => {
    let newErrors = {};

    // Validate organization, branch, and customerName
    if (!formData.organization)
      newErrors.organization = errorMessage.organizationName;
    if (!formData.branchName) newErrors.branchName = errorMessage.branchName;
    if (!formData.customerName)
      newErrors.customerName = errorMessage.customerName;
    if (!formData.customerPhone) newErrors.customerPhone = errorMessage.mobile;
    if (formData.customerPhone && !/^\d+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = formatMessage.mobile;
    } else if (formData.customerPhone && formData.customerPhone.length !== 10) {
      newErrors.customerPhone = lengthMessage.mobile;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    try {
      if (!validateStockForm()) {
        return;
      }
      await createCustomer({
        ...formData,
        role: field == "stock" ? "Buyer" : "Seller",
        organization: formData?.organization?.value,
        branchName: formData?.branchName?.value,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOrganizationChange = (selectedOrg) => {
    setSelectedOrganization(selectedOrg.value);
    setFormData((prev) => ({
      ...prev,
      organization: selectedOrg,
    }));
  };

  const handleOrganizationBranchChange = (selectedOrgBranch) => {
    setFormData((prev) => ({
      ...prev,
      branchName: selectedOrgBranch,
    }));
  };

  return (
    <Dialog
      open={customerDialog}
      handleClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        sx={{
          padding: 3,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <DialogTitle>
          <Typography style={{ textAlign: "center" }}>Customer</Typography>

          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 16, top: 16, color: "red" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <OrgInput
                  role="user"
                  onChange={handleOrganizationChange}
                  value={formData.organization}
                  error={errors.organization}
                />
              </Grid>
              <Grid item xs={12}>
                <OrgBranchInput
                  role="user"
                  onChange={handleOrganizationBranchChange}
                  value={formData.branchName}
                  selectedOrganization={selectedOrganization}
                  error={errors.branchName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  variant="outlined"
                  name="customerName"
                  value={formData.customerName || ""}
                  onChange={handleChange}
                  error={errors.customerName}
                  helperText={errors.customerName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Phone number"
                  variant="outlined"
                  name="customerPhone"
                  value={formData.customerPhone || ""}
                  onChange={handleChange}
                  error={errors.customerPhone}
                  helperText={errors.customerPhone}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add
            </Button>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CustomerDialog;
