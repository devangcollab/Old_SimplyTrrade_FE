import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import {
  createAccount,
  getOneAccount,
  updateAccount,
} from "../apis/AccountApi";
import { errorMessage } from "../../errorMessage";

const AccountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organization: null,
    branchName: null,
    accountName: "",
    balance: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [loggedUserData, setLoggedUserData] = useState({});

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
    if (!formData.accountName) newErrors.accountName = errorMessage.accountName;
    if (!formData.balance) newErrors.balance = errorMessage.balance;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    if (!validateStockForm()) {
      return;
    }
    try {
      if (id) {
        await updateAccount(
          {
            ...formData,
            organization: formData.organization.value,
            branchName: formData.branchName.value,
          },
          id
        );
        navigate("/accountPage");
      } else {
        await createAccount({
          ...formData,
          organization: formData.organization.value,
          branchName: formData.branchName.value,
        });
        navigate("/accountPage");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      const response = await getOneAccount(id);
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
      branchName: selectedOrgBranch,
    }));
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          ACCOUNT
        </Typography>
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
      <Grid container spacing={2} mt={2}>
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
            error={errors.branch}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Enter Account Name"
            variant="outlined"
            name="accountName"
            value={formData.accountName || ""}
            onChange={handleChange}
            error={errors.accountName}
            helperText={errors.accountName}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Enter Balance"
            variant="outlined"
            type="number"
            name="balance"
            value={formData.balance || ""}
            onChange={handleChange}
            error={errors.balance}
            helperText={errors.balance}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="outlined"
          color="error"
          sx={{ mr: 2 }}
          onClick={() => navigate("/accountPage")}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AccountForm;
