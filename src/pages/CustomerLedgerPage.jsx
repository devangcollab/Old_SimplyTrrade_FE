import * as React from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import CustomerLedgerTable from "../tables/CustomerLedgerTable";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import OrgInput from "../components/common/OrgInput";
import CustomerInput from "../components/common/CustomerInput";
import axios from "axios";
import OrgBranchInput from "../components/common/OrgBranchInput";
const CustomerLedgerPage = () => {
  const [selectedOrganization, setSelectedOrganization] = React.useState(null);
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [selectedRadioFilter, setSelectedRadioFilter] = React.useState("all");
  const [dateRange, setDateRange] = React.useState({
    startDate: "",
    endDate: "",
  });

  React.useEffect(() => {
    const userData = localStorage.getItem("role");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);

        if (parsedData.role == "user") {
          setSelectedBranch({
            label: parsedData?.orgBranch?.branchName,
            value: parsedData.orgBranch?._id,
          });
        } else {
          setSelectedBranch(null);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [selectedRadioFilter]);

  const handleOrganizationChange = (selectedOrg) => {
    setSelectedOrganization(selectedOrg);
    setSelectedCustomer(null);
  };
  const handleCustomerChange = (selectedCustomer) => {
    setSelectedCustomer(selectedCustomer);
  };
  const handleRadioFilter = (e) => {
    setSelectedCustomer(null);
    setSelectedOrganization(null);
    setSelectedRadioFilter(e.target.value);
  };

  const api_call = import.meta.env.VITE_API_URL;

  const handleDownload = async () => {
    try {
      const res = await axios.get(`${api_call}/export-ledger`, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      });

      // Create a blob URL from the PDF stream
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoiceCustomerLedger${Math.random()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          CUSTOMER LEDGER
        </Typography>

        <Box display="flex" gap={2} width={"60%"} alignContent={"center"}>
          <TextField
            disabled={selectedRadioFilter == "all"}
            fullWidth
            type="date"
            label="Start Date"
            name="startDate"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
            sx={{ backgroundColor: "white", borderRadius: 1, width: "50%" }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            disabled={selectedRadioFilter == "all"}
            fullWidth
            type="date"
            label="End Date"
            name="endDate"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
            sx={{ backgroundColor: "white", borderRadius: 1, width: "50%" }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button
            variant="outlined"
            sx={{
              color: "#6c5ce7",
              borderColor: "#6c5ce7",
              textTransform: "none",
              fontSize: "1rem",
              width: "30%",
            }}
            onClick={handleDownload}
          >
            Download PDF
          </Button>
        </Box>
      </Box>
      <Box sx={{ marginTop: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="radioFilter"
              defaultValue="all"
              onChange={handleRadioFilter}
              sx={{
                fontWeight: "bold",
                color: "#6c5ce7",
                padding: "0.4rem",
              }}
            >
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel
                value="stock"
                control={<Radio />}
                label="Stock"
              />
              <FormControlLabel value="sell" control={<Radio />} label="Sell" />
              <FormControlLabel
                value="repair"
                control={<Radio />}
                label="Repair"
              />
            </RadioGroup>
          </Grid>

          <Grid item xs={3}>
            {selectedBranch ? (
              <OrgBranchInput value={selectedBranch} role="user" />
            ) : (
              <OrgInput
                onChange={handleOrganizationChange}
                value={selectedOrganization}
              />
            )}
          </Grid>

          <Grid item xs={3}>
            {selectedBranch ? (
              <CustomerInput
                onChange={handleCustomerChange}
                branchId={selectedBranch?.value}
                value={selectedCustomer}
                field={selectedRadioFilter}
                role="user"
              />
            ) : (
              <CustomerInput
                onChange={handleCustomerChange}
                orgId={selectedOrganization}
                value={selectedCustomer}
                field={selectedRadioFilter}
                role="admin"
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <CustomerLedgerTable
        selectedOrganization={selectedOrganization}
        selectedCustomer={selectedCustomer}
        selectedRadioFilter={selectedRadioFilter}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
      />
    </Box>
  );
};

export default CustomerLedgerPage;
