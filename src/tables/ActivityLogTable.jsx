import React, { useEffect, useState } from "react";
import {
  Box,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";

import axios from "axios";
import moment from "moment";

const ActivityLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [userId, setUserId] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const api_call = import.meta.env.VITE_API_URL;

  // Fetch Activity Logs from API
  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${api_call}/getActivityLog`, {
        params: {
          userId: userId || undefined,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
          limit: paginationModel.pageSize,
          search: searchTerm,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLogs(response.data.data);
      setTotalRows(response.data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [paginationModel, userId, dateRange]);

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
    setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset to first page
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // setUserId(event.target.value)
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "organization", headerName: "Organization", flex: 1 },
    { field: "branch", headerName: "Branch", flex: 1 },
    { field: "message", headerName: "Message", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.date).format("DD-MM-YYYY, h:mm a"),
    },
  ];

  const rows = Array.isArray(logs)
    ? logs.map((log) => ({
        id: log._id,
        name: log.name || "N/A",
        role: log.role || "N/A",
        organization: log.organization?.organizationName || "N/A",
        branch: log.branchName?.branchName || "N/A",
        message: log.message || "No message",
        date: log.createdAt || null,
      }))
    : [];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
        Activity Logs
      </Typography>

      <Box display="flex" gap={2} my={2}>
        <TextField
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#6c5ce7" }} />{" "}
                {/* Search icon color */}
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="date"
          label="Start Date"
          value={dateRange.startDate}
          onChange={(e) => handleDateChange("startDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, backgroundColor: "white", borderRadius: 1 }}
        />
        <TextField
          type="date"
          label="End Date"
          value={dateRange.endDate}
          onChange={(e) => handleDateChange("endDate", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, backgroundColor: "white", borderRadius: 1 }}
        />
      </Box>

      <Paper
        sx={{
          height: "auto",
          width: "100%",
          marginTop: "2rem",
          overflowX: "auto",
          boxSizing: "border-box",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={paginationModel.pageSize}
          rowCount={totalRows}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10]}
          sx={{
            border: 0,
            minWidth: "100%",
            "& .MuiDataGrid-columnHeader": {
              background: "#C4BDFF",
              color: "white",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "1.2rem",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ActivityLogTable;
