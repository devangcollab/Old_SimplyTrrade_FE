import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import DeleteDialog from "../components/DeleteDialog";
import DialogBox from "../components/DialogBox";
import { allSell, deleteSell } from "../apis/SellApi";
import moment from "moment";
import axios from "axios";
const SellTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sellData, setSellData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const callApi = async () => {
    const response = await allSell(
      paginationModel.page + 1,
      paginationModel.pageSize,
      searchTerm
    );

    setSellData(response.data.items);
    setTotalRows(response.data.totalCount);
  };

  useEffect(() => {
    callApi(); // +1 for 1-based API pagination
  }, [paginationModel.page, paginationModel.pageSize, searchTerm]);

  const api_call = import.meta.env.VITE_API_URL;

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${api_call}/sellByDate`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSellData(response.data.data); // ✅ Update the table rows
      setTotalRows(response.data.data.length); // ✅ Optional: update total count
    } catch (error) {
      console.error("Error fetching filtered expenses:", error);
    }
  };

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchExpenses();
    }
  }, [dateRange.startDate, dateRange.endDate]);

  const handleOpen = (data) => {
    setData(data);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const openDeleteDialog = (id) => {
    setDeleteOpen(id);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    callApi();
  };

  const handleDelete = async (id) => {
    deleteSell(id);
    setDeleteOpen(false);
    handleClose();
    callApi();
  };

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
    callApi(newPaginationModel.page + 1, newPaginationModel.pageSize); // Pass page + 1 since API is likely 1-based
  };

  const columns = [
    { field: "organization", headerName: "Organization", flex: 1 },
    { field: "organizationBranch", headerName: "Branch", flex: 1 },
    { field: "model", headerName: "Model", flex: 1 },
    { field: "device", headerName: "Device", flex: 1 },
    { field: "purchaseAmount", headerName: "Purchase Amount", flex: 1 },
    { field: "sellAmount", headerName: "Sell Amount", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
  ];

  const rows = Array.isArray(sellData)
    ? sellData.map((sellData) => ({
        id: sellData._id,
        organization: sellData?.organization?.organizationName,
        organizationBranch: sellData?.branch?.branchName,
        model: sellData?.modelName?.modelName,
        device: sellData?.deviceName?.deviceName,
        purchaseAmount: sellData?.stock?.totalAmount,
        sellAmount: sellData?.amount,
        date: moment(sellData?.createdAt).format("DD-MM-YYYY"),
      }))
    : [];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          SELL DEVICES
        </Typography>
        <Box display="flex" gap={2} width={"40%"} alignContent={"center"}>
          <TextField
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
            fullWidth
            type="date"
            label="End Date"
            name="endDate"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
            sx={{ backgroundColor: "white", borderRadius: 1, width: "50%" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
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
            "& .MuiDataGrid-columnHeader": {
              background: "#C4BDFF",
              color: "White",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "1.2rem",
            },
          }}
        />
      </Paper>

      <DialogBox
        handleClose={handleClose}
        open={open}
        data={data}
        callApi={callApi}
        fieldName="organizationForm"
      />
      <DeleteDialog
        deleteOpen={deleteOpen}
        handleClose={handleClose}
        handleDelete={handleDelete}
        closeDeleteDialog={closeDeleteDialog}
      />
    </Box>
  );
};

export default SellTable;
