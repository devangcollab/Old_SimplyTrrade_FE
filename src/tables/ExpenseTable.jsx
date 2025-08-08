import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DialogBox from "../components/DialogBox";
import DeleteDialog from "../components/DeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteExpense, getAllExpense } from "../apis/ExpenseApi";
import moment from "moment";
import axios from "axios";

const ExpenseTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [expense, setExpense] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Function to fetch data from the API based on pagination model
  const callApi = async () => {
    try {
      const response = await getAllExpense(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchTerm
      ); // +1 because API uses 1-based indexing

      setExpense(response.data.items); // Set the items to orgData
      setTotalRows(response.data.totalCount); // Set the total count (rowCount) from API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const api_call = import.meta.env.VITE_API_URL;

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${api_call}/expenseByDate`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setExpense(response.data.data); // ✅ Update the table rows
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

  // Fetch data when pagination model changes
  useEffect(() => {
    callApi(); // Call API when page or pageSize changes
  }, [paginationModel, searchTerm]);

  // Handle pagination model change (page or pageSize)
  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const handleOpen = (data) => {
    setData(data);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const openDeleteDialog = (id) => {
    setDeleteOpen(id);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    callApi();
  };

  const handleDelete = async (id) => {
    deleteExpense(id);

    setDeleteOpen(false);
    handleClose();
    callApi();
  };
  const columns = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <>
          <Link to={`/expenseForm/${params.row.id}`}>
            <IconButton>
              <EditIcon sx={{ color: "#6c5ce7" }} />
            </IconButton>
          </Link>
          <IconButton onClick={() => openDeleteDialog(params.row.id)}>
            <DeleteIcon sx={{ color: "#6c5ce7" }} />
          </IconButton>
        </>
      ),
    },
    { field: "organization", headerName: "Organization", flex: 1 },
    { field: "branchName", headerName: "Branch", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "modelName", headerName: "Model", flex: 1 },
    { field: "deviceName", headerName: "Device", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
  ];

  // Prepare the rows for the DataGrid
  const rows = expense.map((expense) => ({
    id: expense._id,
    organization: expense.organization.organizationName,
    branchName: expense.branchName.branchName,
    modelName: expense.modelName?.modelName || "N/A",
    deviceName: expense.deviceName?.deviceName || "N/A",
    description: expense.description,
    date: moment(expense.date).format("DD-MM-YYYY"),
    amount: expense.amount,
    category: expense.category,
  }));

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#6c5ce7" }}
          >
            EXPENSE
          </Typography>

          <Box display="flex" gap={2} width={"60%"} alignContent={"center"}>
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
            <Button
              variant="outlined"
              sx={{
                color: "#6c5ce7",
                borderColor: "#6c5ce7",
                textTransform: "none",
                // fontWeight: "bold",
                fontSize: "1rem",
                width: "30%",
              }}
              component={Link}
              to="/expenseForm"
            >
              Add Expense
            </Button>
          </Box>
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
      <DialogBox
        handleClose={handleClose}
        open={open}
        data={data}
        callApi={callApi}
        fieldName="expenseForm"
      />
      <DeleteDialog
        deleteOpen={deleteOpen}
        handleClose={handleClose}
        handleDelete={handleDelete}
        closeDeleteDialog={closeDeleteDialog}
      />
    </>
  );
};

export default ExpenseTable;
