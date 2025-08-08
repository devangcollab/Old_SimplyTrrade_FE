import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createModel, findOneModel, updateModel } from "../apis/ModelApi";
import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import CategoryInput from "./common/CategoryInput";
import { errorMessage } from "../../errorMessage";

const ModelForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    organization: null,
    branchName: null,
    modelName: "",
    categoryId: null,
  });

  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [branchId, setBranchId] = useState("");

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
    if (!formData.branchName) newErrors.branchName = errorMessage.branchName;
    if (!formData.categoryId) newErrors.categoryId = errorMessage.categoryName;
    if (!formData.modelName) newErrors.modelName = errorMessage.modelName;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (id) {
        updateModel(
          {
            ...formData,
            organization: formData.organization.value,
            branchName: formData.branchName.value,
            categoryId: formData.categoryId.value,
          },
          id
        );
      } else {
        createModel({
          ...formData,
          organization: formData.organization.value,
          branchName: formData.branchName.value,
          categoryId: formData.categoryId.value,
        });
      }
      navigate("/modelPage");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      const response = await findOneModel(id);
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
        categoryId: {
          label: response.data.data.categoryId.categoryName,
          value: response.data.data.categoryId._id || "",
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
    setBranchId(selectedOrgBranch.value);
    setFormData((prev) => ({
      ...prev,
      branchName: selectedOrgBranch,
    }));
  };

  const handleCategoryChange = (selectedCategory) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: selectedCategory,
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
        MODEL
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
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
              value={formData.branchName}
              selectedOrganization={selectedOrganization}
              error={errors.branchName}
            />
          </Grid>
          <Grid item xs={6}>
            <CategoryInput
              onChange={handleCategoryChange}
              value={formData.categoryId}
              branchId={branchId}
              error={errors.categoryId}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Model"
              variant="outlined"
              name="modelName"
              value={formData.modelName || ""}
              onChange={handleChange}
              required
              error={!!errors.modelName}
              helperText={errors.modelName}
            />
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
          to="/modelPage"
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add
        </Button>
      </Grid>
    </Box>
  );
};

export default ModelForm;
