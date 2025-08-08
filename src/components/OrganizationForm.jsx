import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { createOrg, updateOrg } from "../apis/OrganizationApi";
import { errorMessage, formatMessage, lengthMessage } from "../../errorMessage";
import UploadButton from "./common/UploadButton";

const OrganizationForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    organizationName: "",
    primaryAddress: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    district: "",
    zipCode: "",
    country: "",
    telePhone: "",
    email: "",
    upload: "",
    gstApplicable: "no",
    gstNumber: "",
    companyType: "",
  });

  const [gstApplicable, setGstApplicable] = useState("no");

  const api_call = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    let newErrors = {};

    if (!formData.organizationName)
      newErrors.organizationName = errorMessage.organizationName;
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
    if (
      !formData.upload ||
      (Array.isArray(formData.upload) && formData.upload.length === 0)
    ) {
      newErrors.upload = errorMessage.upload;
    }
    // Email validation (simple regex)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = formatMessage.email;
    }

    // Zip Code validation (only numbers)
    if (formData.zipCode) {
      if (!/^\d+$/.test(formData.zipCode)) {
        newErrors.zipCode = formatMessage.zipCode;
      } else if (formData.zipCode.length !== 6) {
        // Enforcing 6-digit length
        newErrors.zipCode = lengthMessage.zipCode;
      }
    }

    // GST Validation if applicable
    if (gstApplicable === "yes" && !formData.gstNumber) {
      newErrors.gstNumber = errorMessage.gstNumber;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const file = files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      // Now you can store base64 in your form state or send it to your database
      setFormData((prev) => ({ ...prev, upload: base64 }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // This returns base64 with data:[mime];base64,...
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (id) {
        updateOrg(formData, id);
        navigate("/organizationPage");
      } else {
        createOrg(formData);
        navigate("/organizationPage");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const callApi = async () => {
    if (id) {
      const response = await axios.get(`${api_call}/org/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFormData(response.data.data);
    }
  };

  useEffect(() => {
    callApi();
  }, []);

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
        Organizations
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Organization Name"
            variant="outlined"
            name="organizationName"
            value={formData.organizationName || ""}
            onChange={handleChange}
            required
            error={!!errors.organizationName}
            helperText={errors.organizationName}
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
            type="number"
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
            label="Company Registration Type"
            variant="outlined"
            name="companyType"
            value={formData.companyType || ""}
            onChange={handleChange}
            required
            error={!!errors.companyType}
            helperText={errors.companyType}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <FormLabel>GST Applicable</FormLabel>
            <RadioGroup
              row
              name="gstApplicable"
              value={formData.gstApplicable || ""}
              onChange={handleChange}
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Yes"
                onChange={(e) => setGstApplicable(e.target.value)}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="No"
                onChange={(e) => setGstApplicable(e.target.value)}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <UploadButton handleChange={handleChange} error={errors.upload} />
        </Grid>

        {gstApplicable == "yes" && (
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="GST Number"
              variant="outlined"
              name="gstNumber"
              value={formData.gstNumber || ""}
              onChange={handleChange}
              required
              error={!!errors.gstNumber}
              helperText={errors.gstNumber}
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
            to="/organizationPage"
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

export default OrganizationForm;
