import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OrgInput from "./common/OrgInput";
import OrgBranchInput from "./common/OrgBranchInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import ModelInput from "./common/ModelInput";
import DeviceInput from "./common/DeviceInput";
import { createRepair, getOneRepair, updateRepair } from "../apis/RepairApi";
import { getOneCustomer } from "../apis/CustomerApi";
import CustomerInput from "./common/CustomerInput";

const RepairForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [branchId, setBranchId] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [loggedUserData, setLoggedUserData] = useState({});

  const [formData, setFormData] = useState({
    organization: null,
    branch: null,
    customerName: null,
    customerPhone: "",
    email: "",
    device: [
      {
        modelName: null,
        deviceName: null,
        amount: "",
        estimatedCost: "",
        status: "",
        date: "",
      },
    ],
  });

  const handleAddDevice = () => {
    setFormData((prev) => ({
      ...prev,
      device: [
        ...prev.device,
        {
          modelName: null,
          deviceName: null,
          amount: "",
          estimatedCost: "",
          status: "",
          date: "",
        },
      ],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
            branch: parsedData?.orgBranch?._id
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

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // if (!validateForm()) return;

    const payload = {
      organization: formData.organization?.value || null,
      branch: formData.branch?.value || null,
      customerName: formData?.customerName?.value || null,
      customerPhone: formData?.customerPhone || "",
      email: formData.email || "",
      device: formData.device.map((device) => ({
        modelName: device?.modelName?.value || null,
        deviceName: device?.deviceName?.value || null,
        amount: device.amount || "",
        estimatedCost: device.estimatedCost || "",
        status: device.status || "",
        date: device.date || "",
      })),
    };

    try {
      if (id) {
        await updateRepair(payload, id);
      } else {
        await createRepair(payload);
      }
      navigate("/repairPage");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      const response = await getOneRepair(id);
      setFormData({
        ...response.data.data,
        organization: {
          label: response.data.data.organization.organizationName,
          value: response.data.data.organization._id || "",
        },
        branch: {
          label: response.data.data.branch.branchName,
          value: response.data.data.branch._id || "",
        },
        customerName: {
          label: response.data.data.customerName.customerName,
          value: response.data.data.customerName._id || "",
        },
        device: [
          {
            modelName: {
              label: response.data.data?.modelName?.modelName,
              value: response.data.data?.modelName?._id || "",
            },
            deviceName: {
              label: response.data.data?.deviceName?.deviceName,
              value: response.data.data?.deviceName?._id || "",
            },
            amount: response.data.data.amount || "",
            estimatedCost: response.data.data.estimatedCost || "",
            status: response.data.data.status || "",
            date: response.data.data.date || "",
          },
        ],
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
      branch: selectedOrgBranch,
    }));
  };

  const handleDeviceChange = (index, field, value) => {
    const updatedDevices = [...formData.device];
    updatedDevices[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      device: updatedDevices,
    }));
  };
  const handleModelInputChange = (index, selectedModel) => {
    setSelectedModel(selectedModel?.value);
    handleDeviceChange(index, "modelName", selectedModel);
  };

  const handleDeviceInputChange = (index, selectedDevice) => {
    setSelectedDevice(selectedDevice.value);
    handleDeviceChange(index, "deviceName", selectedDevice);
  };
  const handleStatusInputChange = (index, selectedDevice) => {
    setSelectedDevice(selectedDevice.value);
    handleDeviceChange(index, "status", selectedDevice);
  };

  const handleCustomerChange = async (selectCustomer) => {
    if (selectCustomer && selectCustomer !== null) {
      const findCustomerPhoneNumber = await getOneCustomer(
        selectCustomer.value
      );

      setFormData({
        ...formData,
        customerPhone: findCustomerPhoneNumber?.data?.data?.customerPhone || "",
      });
    } else {
      setFormData({
        ...formData,
        customerPhone: "",
      });
    }

    setFormData((prev) => ({
      ...prev,
      customerName: selectCustomer,
    }));
  };

  const handleRemoveDevice = (index) => {
    const updatedDevices = formData.device.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      device: updatedDevices,
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
        REPAIR
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <OrgInput
              role={loggedUserData.role == "admin" ? "admin" : "user"}
              onChange={handleOrganizationChange}
              value={formData.organization || null}
              // error={errors.organization}
            />
          </Grid>

          <Grid item xs={6}>
            <OrgBranchInput
              role={loggedUserData.role == "admin" ? "admin" : "user"}
              onChange={handleOrganizationBranchChange}
              value={formData.branch || null}
              selectedOrganization={selectedOrganization}
              // error={errors.branch}
            />
          </Grid>

          <Grid item xs={6}>
            <CustomerInput
              onChange={handleCustomerChange}
              value={formData.customerName}
              branchId={formData?.branch?.value}
              error={errors.customerName}
              filed="sell"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Phone Number"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          {formData.device.map((device, index) => (
            <React.Fragment key={index}>
              <Grid
                item
                xs={11}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                {index > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveDevice(index)}
                  >
                    Remove
                  </Button>
                )}
              </Grid>
              <Grid item xs={1}>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddDevice}
                  >
                    ADD DEVICE
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <ModelInput
                  branchId={branchId}
                  value={device.modelName || ""}
                  onChange={(value) => handleModelInputChange(index, value)}
                  error={errors.modelName}
                />
              </Grid>

              <Grid item xs={6}>
                <DeviceInput
                  modelId={selectedModel}
                  value={device.deviceName || ""}
                  onChange={(value) => handleDeviceInputChange(index, value)}
                  error={errors.deviceName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  value={device.amount}
                  onChange={(e) =>
                    handleDeviceChange(index, "amount", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Estimated Cost"
                  name="estimatedCost"
                  value={device.estimatedCost}
                  onChange={(e) =>
                    handleDeviceChange(index, "estimatedCost", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={device.status || ""}
                    onChange={(e) =>
                      handleStatusInputChange(index, e.target.value)
                    }
                    label="Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="InProcess">In-Process</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  name="date"
                  InputLabelProps={{ shrink: true }}
                  value={device.date}
                  onChange={(e) =>
                    handleDeviceChange(index, "date", e.target.value)
                  }
                />
              </Grid>
              {/* Remove button */}
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Stack>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                UPLOAD
              </Button>
            </Stack>
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
          to="/repairPage"
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

export default RepairForm;
