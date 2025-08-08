import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  getOneCategory,
  updateCategory,
} from "../apis/CategoryApi";

import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import { errorMessage } from "../../errorMessage";
import { toast } from "react-toastify";

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // For loading state
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    categoryName: "",
    orgBranchId: null,
    orgId: null,
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
    if (!formData.orgId) newErrors.orgId = errorMessage.organizationName;
    if (!formData.orgBranchId) newErrors.orgBranchId = errorMessage.branchName;
    if (!formData.categoryName)
      newErrors.categoryName = errorMessage.categoryName;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true); // Set loading before submitting
    try {
      const categoryData = {
        ...formData,
        orgId: formData.orgId?.value || formData.orgId, // Ensure we handle both direct ID and object
        orgBranchId: formData.orgBranchId?.value || formData.orgBranchId,
      };

      if (id) {
        await updateCategory(categoryData, id);
      } else {
        await createCategory(categoryData);
      }
      navigate("/category");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Stop loading after submission
    }
  };

  const callApi = async () => {
    if (id) {
      setLoading(true); // Set loading when calling API
      try {
        const response = await getOneCategory(id);
        setFormData({
          ...response.data.data,
          orgId: {
            label: response.data.data.orgId.organizationName,
            value: response.data.data.orgId._id || "",
          },
          orgBranchId: {
            label: response.data.data.orgBranchId.branchName,
            value: response.data.data.orgBranchId._id || "",
          },
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category data.");
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    }
  };

  useEffect(() => {
    callApi();
  }, [id]);

  const handleOrganizationChange = (selectedOrg) => {
    setSelectedOrganization(selectedOrg.value);
    setFormData((prev) => ({
      ...prev,
      orgId: selectedOrg,
    }));
  };

  const handleOrganizationBranchChange = (selectedOrgBranch) => {
    setFormData((prev) => ({
      ...prev,
      orgBranchId: selectedOrgBranch,
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
        CATEGORY
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <OrgInput
              onChange={handleOrganizationChange}
              value={formData.orgId}
              error={errors.orgId}
            />
          </Grid>
          <Grid item xs={6}>
            <OrgBranchInput
              onChange={handleOrganizationBranchChange}
              value={formData.orgBranchId}
              selectedOrganization={selectedOrganization}
              error={errors.orgBranchId}
            />
          </Grid>
        </Grid>
      </Box>

      <TextField
        fullWidth
        label="Category"
        variant="outlined"
        name="categoryName"
        value={formData.categoryName || ""}
        onChange={handleChange}
        required
        error={!!errors.categoryName}
        helperText={errors.categoryName}
      />

      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Button
          variant="contained"
          color="error"
          component={Link}
          to="/category"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : id ? (
            "Update"
          ) : (
            "Add"
          )}
        </Button>
      </Grid>
    </Box>
  );
};

export default CategoryForm;
