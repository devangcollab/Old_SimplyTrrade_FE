import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

const PaymentInput = ({ onChange, value, error, branchId, disabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const api_call = import.meta.env.VITE_API_URL;

  // Debounced API call wrapped in useCallback to avoid unnecessary recreations
  const fetchOrganizations = useCallback(
    debounce(async (query) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://${api_call}/api/selectAccountByBranch`,
          {
            params: { text: query, branchId: branchId }, // Query parameters
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Request headers
          }
        );

        const formattedOptions = (response.data.data || []).map((org) => ({
          label: org.accountName,
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
    [branchId]
  );

  // Fetch organizations when inputValue changes
  useEffect(() => {
    if (branchId) {
      if (inputValue.trim() !== "") {
        fetchOrganizations(inputValue);
      } else {
        fetchOrganizations(""); // Load default options
      }
    }
  }, [inputValue, fetchOrganizations, branchId]);

  return (
    <Autocomplete
      disabled={disabled}
      options={options}
      getOptionLabel={(option) => option.label}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, val) => option.value === val?.value}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      onChange={(_, newValue) => {
        if (newValue) {
          onChange(newValue);
        } else {
          onChange(null);
        }
      }}
      renderInput={(params) => (
        <TextField
          error={!!error}
          helperText={error}
          {...params}
          label="Payment Account"
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
  );
};

export default PaymentInput;
