import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createUser, getOneUser, updateUser } from "../apis/UserApi";
import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import { errorMessage, formatMessage, lengthMessage } from "../../errorMessage";

const UserForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    organization: null,
    orgBranch: null,
    name: "",
    email: "",
    mobileNo: "",
    password: "",
  });
  const [selectedOrganization, setSelectedOrganization] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.organization)
      newErrors.organization = errorMessage.organizationName;
    if (!formData.orgBranch) newErrors.orgBranch = errorMessage.branchName;
    if (!formData.name) newErrors.name = errorMessage.name;
    if (!formData.email) newErrors.email = errorMessage.email;
    if (!formData.mobileNo) newErrors.mobileNo = errorMessage.mobile;
    if (!formData.password) newErrors.password = errorMessage.password;

    // Email validation (simple regex)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = formatMessage.email;
    }

    if (formData.mobileNo) {
      if (!/^\d+$/.test(formData.mobileNo)) {
        newErrors.mobile = formatMessage.mobile;
      } else if (formData.mobileNo.length !== 10) {
        // Enforcing 10-digit length
        newErrors.mobile = lengthMessage.mobile;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (id) {
        await updateUser(
          {
            ...formData,
            organization: formData.organization.value,
            orgBranch: formData.orgBranch.value,
          },
          id
        );
      } else {
        await createUser({
          ...formData,
          organization: formData.organization.value,
          orgBranch: formData.orgBranch.value,
          role: "user",
        });
      }
      navigate("/userPage");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      const response = await getOneUser(id);
      setFormData({
        ...response.data.data,
        organization: {
          label: response.data.data.organization.organizationName,
          value: response.data.data.organization._id || "",
        },
        orgBranch: {
          label: response.data.data.orgBranch.branchName,
          value: response.data.data.orgBranch._id || "",
        },
      });
    }
  };

  useEffect(() => {
    callApi();
  }, []);

  const handleOrganizationChange = (selectedOrg) => {
    setFormData((prev) => ({
      ...prev,
      organization: selectedOrg,
    }));
    setSelectedOrganization(selectedOrg.value);
  };

  const handleOrganizationBranchChange = (selectedOrgBranch) => {
    setFormData((prev) => ({
      ...prev,
      orgBranch: selectedOrgBranch,
    }));
  };

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
        User
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
          <OrgBranchInput
            onChange={handleOrganizationBranchChange}
            value={formData.orgBranch}
            selectedOrganization={selectedOrganization}
            error={errors.orgBranch}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Enter Name"
            variant="outlined"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            error={errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Enter Email Address"
            variant="outlined"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
            error={errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Enter Phone Number"
            variant="outlined"
            name="mobileNo"
            value={formData.mobileNo || ""}
            onChange={handleChange}
            required
            error={errors.mobileNo}
            helperText={errors.mobileNo}
          />
        </Grid>
        {!id && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Enter Password"
              variant="outlined"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              required
              error={errors.password}
              helperText={errors.password}
            />
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            variant="contained"
            color="error"
            component={Link}
            to="/userPage"
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

export default UserForm;
