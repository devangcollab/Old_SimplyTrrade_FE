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
import React, { useEffect, useState } from "react";
import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createExpense,
  getOneExpense,
  updateExpense,
} from "../apis/ExpenseApi";
import ModelInput from "./common/ModelInput";
import DeviceInput from "./common/DeviceInput";
import { getOneStock, updateStock } from "../apis/StockApi";
import moment from "moment";

const ExpenseForm = ({ stockId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    organization: null,
    branchName: null,
    modelName: null,
    deviceName: null,
    date: "",
    category: !stockId ? "General" : "",
    amount: "",
    description: "",
    stock: "",
  });
  const [loggedUserData, setLoggedUserData] = useState({});
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [branchId, setBranchId] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");

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
      newErrors.organization = "Organization is required";
    if (!formData.branchName) newErrors.branchName = "Branch Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.category == "Phone") {
      if (!formData.modelName) newErrors.modelName = "modelName is required";
      if (!formData.deviceName) newErrors.deviceName = "deviceName is required";
    }
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    if (!validateForm()) {
      return;
    }

    let payload;
    if (formData.category == "Phone") {
      payload = {
        organization: formData.organization?.value || "",
        branchName: formData.branchName?.value || "",
        category: formData.category || "",
        modelName: formData.modelName?.value || "",
        deviceName: formData.deviceName?.value || "",
        amount: formData.amount || "",
        date: formData.date || "",
        description: formData.description || "",
        stock: stockId ? id : formData.stock,
        expense: formData.expense || "",
      };
    } else {
      payload = {
        organization: formData.organization?.value || "",
        branchName: formData.branchName?.value || "",
        category: formData.category || "",
        amount: formData.amount || "",
        date: formData.date || "",
        description: formData.description || "",
      };
    }

    try {
      if (stockId) {
        if (!formData.expense) {
          await createExpense(payload);
          navigate("/stockPage");
        } else {
          await updateExpense(payload, formData.expense);
          navigate("/stockPage");
        }
      } else if (id) {
        await updateExpense(payload, id);
        // toast.success("Expense updated successfully!");
        navigate("/expensePage");
      } else {
        await createExpense(payload);
        navigate("/expensePage");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      let response;
      if (stockId) {
        response = await getOneStock(id);

        setFormData({
          ...response.data.data,
          amount: response.data?.data?.expenseAmount || "",
          date:
            moment(response.data?.data?.expenseDate).format("YYYY-MM-DD") || "",
          description: response.data?.data?.expenseDescription || "",
          expense: response.data?.data?.expense || "",
          category: "Phone",
          organization: {
            label: response.data.data.organization.organizationName,
            value: response.data.data.organization._id || "",
          },
          branchName: {
            label: response.data.data.branch.branchName,
            value: response.data.data.branch._id || "",
          },
          modelName: {
            label: response.data.data?.modelName?.modelName,
            value: response.data.data?.modelName?._id || "",
          },
          deviceName: {
            label: response.data.data?.deviceName?.deviceName,
            value: response.data.data?.deviceName?._id || "",
          },
        });
      } else {
        response = await getOneExpense(id);

        setFormData({
          ...response.data.data,
          stock: response.data.data.stock?._id,
          date:
            moment(response.data?.data?.expenseDate).format("YYYY-MM-DD") || "",
          organization: {
            label: response.data.data.organization?.organizationName,
            value: response.data.data.organization?._id || "",
          },
          branchName: {
            label: response.data.data.branchName?.branchName,
            value: response.data.data.branchName?._id || "",
          },

          modelName: {
            label: response.data.data?.modelName?.modelName,
            value: response.data.data?.modelName?._id || "",
          },
          deviceName: {
            label: response.data.data?.deviceName?.deviceName,
            value: response.data.data?.deviceName?._id || "",
          },
        });
      }
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

  const handleModelChange = (selectedModel) => {
    setSelectedModel(selectedModel?.value);
    setFormData((prev) => ({
      ...prev,
      modelName: selectedModel,
    }));
  };
  const handleDeviceChange = (selectedDevice) => {
    setSelectedDevice(selectedDevice.value);
    setFormData((prev) => ({
      ...prev,
      deviceName: selectedDevice,
    }));
  };

  const handleNativeDateChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      date: value,
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
        EXPENSE
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <OrgInput
              role={loggedUserData.role == "admin" ? "admin" : "user"}
              onChange={handleOrganizationChange}
              value={formData.organization || null}
              error={errors.organization}
              readOnlyExp={id}
            />
          </Grid>

          <Grid item xs={6}>
            <OrgBranchInput
              role={loggedUserData.role == "admin" ? "admin" : "user"}
              onChange={handleOrganizationBranchChange}
              value={formData.branchName || null}
              selectedOrganization={selectedOrganization}
              error={errors.branchName}
              readOnlyExp={id}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl
              disabled
              fullWidth
              variant="outlined"
              error={!!errors.category}
              required
            >
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="General">General</MenuItem>
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {formData.category == "Phone" ? (
            <>
              <Grid item xs={6}>
                <ModelInput
                  branchId={branchId}
                  onChange={handleModelChange}
                  value={formData.modelName || ""}
                  error={errors.modelName}
                  readOnlyExp={id}
                />
              </Grid>
              <Grid item xs={6}>
                <DeviceInput
                  modelId={selectedModel}
                  onChange={handleDeviceChange}
                  value={formData.deviceName || ""}
                  error={errors.deviceName}
                  readOnlyExp={id}
                />
              </Grid>
            </>
          ) : (
            ""
          )}

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleNativeDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              required
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Amount"
              variant="outlined"
              name="amount"
              value={formData.amount || ""}
              onChange={handleChange}
              required
              error={!!errors.amount}
              helperText={errors.amount}
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
          to="/expensePage"
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {id ? (stockId ? "Add" : "Update") : "Add"}
        </Button>
      </Grid>
    </Box>
  );
};

export default ExpenseForm;
