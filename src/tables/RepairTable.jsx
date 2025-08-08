import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogBox from "../components/DialogBox";
import DeleteDialog from "../components/DeleteDialog";
import SearchIcon from "@mui/icons-material/Search";
import { deleteRepair, getAllRepair } from "../apis/RepairApi";
import moment from "moment";
import noDataImage from "../assets/Group 18992.png";

const RepairTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [repair, setRepair] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const callApi = async () => {
    try {
      const response = await getAllRepair(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchTerm
      );
      setRepair(response.data.items); // Set the items to orgData
      setTotalRows(response.data.totalCount); // Set the total count (rowCount) from API response
    } catch (error) {
      console.error("Error fetching organization branch data:", error);
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

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
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
    deleteRepair(id);

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
          <Link to={`/repairForm/${params.row.id}`}>
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
    { field: "branch", headerName: "Branch", flex: 1 },
    { field: "customerName", headerName: "customerName", flex: 1 },
    { field: "email", headerName: "email", flex: 1 },
    { field: "modelName", headerName: "modelName", flex: 1 },
    { field: "deviceName", headerName: "deviceName", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "status", headerName: "status", flex: 1 },
  ];

  // Prepare the rows for the DataGrid
  const rows = Array.isArray(repair)
    ? repair.map((repair) => ({
        id: repair._id,
        organization: repair.organization.organizationName,
        branch: repair.branch.branchName,
        customerName: repair?.customerName?.customerName,
        email: repair.email,
        modelName: repair?.modelName?.modelName,
        deviceName: repair?.deviceName?.deviceName,
        amount: repair.amount,
        date: moment(repair.date).format("DD-MM-YYYY"),
        status: repair.status,
      }))
    : [];

  const CustomNoRowsOverlay = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <img
          src={noDataImage}
          alt="No data Image"
          style={{ width: 100, marginBottom: 16 }}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          REPAIR
        </Typography>

        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search by Email"
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
            to="/repairForm"
          >
            Add
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
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
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
        fieldName="repairForm"
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

export default RepairTable;
