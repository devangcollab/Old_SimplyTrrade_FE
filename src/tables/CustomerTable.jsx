import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DialogBox from "../components/DialogBox";
import SearchIcon from "@mui/icons-material/Search";
import DeleteDialog from "../components/DeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteCustomer, getAllCustomer } from "../apis/CustomerApi";

const CustomerTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [customer, setCustomer] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Function to fetch data from the API based on pagination model
  const callApi = async () => {
    try {
      const response = await getAllCustomer(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchTerm
      ); // +1 because API uses 1-based indexing
      setCustomer(response.data.data.items); // Set the items to orgData
      setTotalRows(response.data.data.totalCount); // Set the total count (rowCount) from API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
    deleteCustomer(id);

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
          <Link to={`/customerForm/${params.row.id}`}>
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
    { field: "customerName", headerName: "Customer Name", flex: 1 },
    { field: "customerPhone", headerName: "Customer Phone", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
  ];

  // Prepare the rows for the DataGrid
  const rows = Array.isArray(customer)
    ? customer.map((customer) => ({
        id: customer._id,
        organization: customer.organization.organizationName,
        branchName: customer.branchName.branchName,
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        role: customer?.role,
      }))
    : [];

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          CUSTOMER
        </Typography>

        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6c5ce7" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            sx={{
              color: "#6c5ce7",
              borderColor: "#6c5ce7",
              textTransform: "none",
            }}
            component={Link}
            to="/customerForm"
          >
            Add Customer
          </Button>
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
          rowCount={totalRows} // Ensure this is set to the total count of records
          paginationMode="server" // Enable server-side pagination
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
        fieldName="customerForm"
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

export default CustomerTable;
