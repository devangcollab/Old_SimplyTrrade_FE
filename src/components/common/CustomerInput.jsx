import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import CustomerDialog from "../CustomerDialog";

const CustomerInput = ({
  onChange,
  value,
  branchId,
  error,
  orgId,
  field,
  role,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [customerData, setCustomerdata] = useState({});

  const api_call = import.meta.env.VITE_API_URL;

  const [customerName, setCustomerName] = useState();
  const callApi = async () => {
    try {
      const response = await axios.get(
        `http://${api_call}/api/findOneOrganizationBranch/${branchId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }, // Request headers
        }
      );
      setCustomerdata(response.data.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    callApi();
  };

  const handleClose = () => setOpen(false);

  // Debounced API call wrapped in useCallback to avoid unnecessary recreations
  const fetchOrganizations = useCallback(
    debounce(async (query) => {
      setLoading(true);
      let apiPath = "";

      if (orgId) {
        if (field === "all") {
          apiPath = `getCustomerByOrg/${orgId.value}`;
        } else if (field === "stock") {
          apiPath = `getBuyerByOrg/${orgId.value}`;
        } else if (field === "sell") {
          apiPath = `getSellerByOrg/${orgId.value}`;
        } else if (field === "repair") {
          apiPath = `getSellerByOrg/${orgId.value}`;
        }
      } else if (branchId) {
        if (field === "all") {
          apiPath = `getCustomerByBranch/${branchId}`;
        } else if (field === "stock") {
          apiPath = `getBuyerByBranch/${branchId}`;
        } else if (field === "sell") {
          apiPath = `getSellerByBranch/${branchId}`;
        } else if (field === "repair") {
          apiPath = `getSellerByBranch/${branchId}`;
        }
      }

      try {
        const response = await axios.get(
          `http://${api_call}/api/${apiPath}`,
          {
            params: { text: query },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const formattedOptions = (response.data.data || []).map((org) => ({
          label: org.customerName,
          value: org._id,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [branchId, orgId, field]
  );

  // Fetch organizations when inputValue changes
  useEffect(() => {
    if (branchId || orgId) {
      if (inputValue.trim() !== "") {
        fetchOrganizations(inputValue);
      } else {
        fetchOrganizations(""); // Load default options
      }
    }
  }, [inputValue, branchId, orgId, field]);

  return (
    <>
      <Autocomplete
        readOnly={role == "admin" && !orgId}
        options={options}
        getOptionLabel={(option) => option.label}
        loading={loading}
        value={value || null}
        isOptionEqualToValue={(option, val) => option.value === val?.value}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={(_, newValue) => {
          if (newValue) {
            onChange(newValue);
          } else {
            onChange(null);
          }
        }}
        noOptionsText={
          branchId ? (
            <>
              <Button onClick={handleOpen}>Create New Customer</Button>
            </>
          ) : (
            "No customers found."
          )
        }
        renderInput={(params) => (
          <TextField
            onChange={(e) => setCustomerName(e.target.value)}
            error={!!error}
            helperText={error}
            {...params}
            label="Customer"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <CustomerDialog
        customerData={customerData}
        customerDialog={open}
        handleClose={handleClose}
        fieldName="customerForm"
        setOpen={setOpen}
        field={field}
        customerName={customerName}
      />
    </>
  );
};

export default CustomerInput;
