import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import {
  createCustomer,
  getOneCustomer,
  updateCustomer,
} from "../apis/CustomerApi";
import { errorMessage, formatMessage, lengthMessage } from "../../errorMessage";

const CustomerForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organization: null,
    branchName: null,
    customerName: "",
    customerPhone: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [loggedUserData, setLoggedUserData] = useState({});
  const [selectedOrganization, setSelectedOrganization] = useState("");

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
    if (!formData.role) newErrors.role = errorMessage.role;
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
    if (!validateStockForm()) {
      return;
    }
    try {
      if (id) {
        await updateCustomer(
          {
            ...formData,
            organization: formData.organization.value,
            branchName: formData.branchName.value,
          },
          id
        );
        navigate("/customerPage");
      } else {
        await createCustomer({
          ...formData,
          organization: formData.organization.value,
          branchName: formData.branchName.value,
        });
        navigate("/customerPage");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      const response = await getOneCustomer(id);
      setFormData({
        ...response.data.data,
        organization: {
          label: response.data.data.organization.organizationName,
          value: response.data.data.organization._id || "",
        },
        branchName: {
          label: response.data.data.branchName.branchName,
          value: response.data.data.branchName._id || "",
        },
      });
    }
  };

  useEffect(() => {
    callApi();
  }, []);

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
  useEffect(() => {
    const userData = localStorage.getItem("role");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);

        setLoggedUserData(parsedData || {});
        if (!parsedData?.organization || !parsedData?.orgBranch) {
          console.warn("Organization or branch data is missing!");
        }

        setFormData((prev) => {
          const updatedFormData = {
            ...prev,
            organization: parsedData?.organization?._id
              ? {
                  label: parsedData?.organization?.organizationName,
                  value: parsedData.organization._id,
                }
              : null,
            branchName: parsedData?.orgBranch?._id
              ? {
                  label: parsedData?.orgBranch?.branchName,
                  value: parsedData.orgBranch._id,
                }
              : null,
          };
          return updatedFormData;
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
        Customer
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <OrgInput
              role={loggedUserData.role == "admin" ? "admin" : "user"}
              onChange={handleOrganizationChange}
              value={formData.organization || null}
              error={errors.organization}
            />
          </Grid>
          <Grid item xs={6}>
            <OrgBranchInput
              role={loggedUserData.role == "admin" ? "admin" : "user"}
              onChange={handleOrganizationBranchChange}
              value={formData.branchName || null}
              selectedOrganization={selectedOrganization}
              error={errors.branchName}
            />
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" error={errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role || ""}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="Buyer">Buyer</MenuItem>
                <MenuItem value="Seller">Seller</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          color="error"
          component={Link}
          to="/customerPage"
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {id ? "Update" : "Add"}
        </Button>
      </Grid>
    </Box>
  );
};

export default CustomerForm;
