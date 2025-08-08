import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  createOrgBranch,
  updateOrgBranch,
} from "../apis/OrganizationBranchApi";
import OrgInput from "./common/OrgInput";
import { errorMessage, formatMessage, lengthMessage } from "../../errorMessage";

const OrganizationBranchForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    organization: null,
    branchName: "",
    primaryAddress: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    district: "",
    zipCode: "",
    country: "",
    telePhone: "",
    mobile: "",
    email: "",
    companyType: "",
  });

  const api_call = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    let newErrors = {};
    if (!formData.organization)
      newErrors.organization = errorMessage.organizationName;
    if (!formData.branchName) newErrors.branchName = errorMessage.branchName;
    if (!formData.addressLine1)
      newErrors.addressLine1 = errorMessage.addressLine1;
    if (!formData.primaryAddress)
      newErrors.primaryAddress = errorMessage.primaryAddress;
    if (!formData.city) newErrors.city = errorMessage.city;
    if (!formData.state) newErrors.state = errorMessage.state;
    if (!formData.district) newErrors.district = errorMessage.district;
    if (!formData.zipCode) newErrors.zipCode = errorMessage.zipCode;
    if (!formData.country) newErrors.country = errorMessage.country;
    if (!formData.email) newErrors.email = errorMessage.email;
    if (!formData.telePhone) newErrors.telePhone = errorMessage.telephone;
    if (!formData.companyType) newErrors.companyType = errorMessage.companyType;
    if (!formData.mobile) newErrors.mobile = errorMessage.mobile;

    // Email validation (simple regex)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = formatMessage.email;
    }

    if (formData.zipCode) {
      if (!/^\d+$/.test(formData.zipCode)) {
        newErrors.zipCode = formatMessage.zipCode;
      } else if (formData.zipCode.length !== 6) {
        // Enforcing 6-digit length
        newErrors.zipCode = lengthMessage.zipCode;
      }
    }

    if (formData.mobile) {
      if (!/^\d+$/.test(formData.mobile)) {
        newErrors.mobile = formatMessage.mobile;
      } else if (formData.mobile.length !== 10) {
        // Enforcing 10-digit length
        newErrors.mobile = lengthMessage.mobile;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (id) {
        await updateOrgBranch(
          { ...formData, organization: formData.organization.value },
          id
        );
      } else {
        await createOrgBranch({
          ...formData,
          organization: formData.organization.value,
        });
      }
      navigate("/organizationBranchPage");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      const response = await axios.get(
        `${api_call}/findOneOrganizationBranch/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFormData({
        ...response.data.data,
        organization: {
          label: response.data.data.organization.organizationName,
          value: response.data.data.organization._id || "",
        },
      });
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  const handleOrganizationChange = (selectedOrg) => {
    if (selectedOrg) {
      setFormData((prev) => ({
        ...prev,
        organization: selectedOrg,
        orgId: selectedOrg.value || "",
      }));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        margin: "auto",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
        Organizations Branch
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <OrgInput
            onChange={handleOrganizationChange}
            value={formData.organization}
            error={errors.organization}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Branch Name"
            variant="outlined"
            name="branchName"
            value={formData.branchName || ""}
            onChange={handleChange}
            required
            error={!!errors.branchName}
            helperText={errors.branchName}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Primary Address"
            variant="outlined"
            name="primaryAddress"
            value={formData.primaryAddress || ""}
            onChange={handleChange}
            required
            error={!!errors.primaryAddress}
            helperText={errors.primaryAddress}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Address Line 1"
            variant="outlined"
            name="addressLine1"
            value={formData.addressLine1 || ""}
            onChange={handleChange}
            required
            error={!!errors.addressLine1}
            helperText={errors.addressLine1}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Address Line 2"
            variant="outlined"
            name="addressLine2"
            value={formData.addressLine2 || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="City"
            variant="outlined"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            required
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="District"
            variant="outlined"
            name="district"
            value={formData.district || ""}
            onChange={handleChange}
            required
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="State"
            variant="outlined"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            required
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Country"
            variant="outlined"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            required
            error={!!errors.country}
            helperText={errors.country}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Zip Code"
            variant="outlined"
            name="zipCode"
            value={formData.zipCode || ""}
            onChange={handleChange}
            required
            error={!!errors.zipCode}
            helperText={errors.zipCode}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            type="number"
            fullWidth
            label="Mobile"
            variant="outlined"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
            required
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            fullWidth
            label="Telephone"
            variant="outlined"
            name="telePhone"
            value={formData.telePhone || ""}
            onChange={handleChange}
            required
            error={!!errors.telePhone}
            helperText={errors.telePhone}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Company Registration type"
            variant="outlined"
            name="companyType"
            value={formData.companyType || ""}
            onChange={handleChange}
            required
            error={!!errors.companyType}
            helperText={errors.companyType}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="contained"
            color="error"
            component={Link}
            to="/organizationBranchPage"
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrganizationBranchForm;
