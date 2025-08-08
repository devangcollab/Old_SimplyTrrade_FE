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
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../components/DeleteDialog";
import DialogBox from "../components/DialogBox";
import SearchIcon from "@mui/icons-material/Search";
import {
  deleteOrgBranch,
  getAllUserOrgBranch,
} from "../apis/OrganizationBranchApi";

const OrganizationBranchTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [orgData, setOrgData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  // Function to fetch data from the API based on pagination model
  const callApi = async () => {
    try {
      const response = await getAllUserOrgBranch(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchTerm
      ); // +1 because API uses 1-based indexing
      setOrgData(response.data.data.items); // Set the items to orgData
      setTotalRows(response.data.data.totalCount); // Set the total count (rowCount) from API response
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

  // Open dialog to view details
  const handleOpen = (data) => {
    setData(data);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Open delete dialog for confirmation
  const openDeleteDialog = (id) => {
    setDeleteOpen(id);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    callApi();
  };

  const handleDelete = async (id) => {
    await deleteOrgBranch(id); // Call delete API
    setDeleteOpen(false);
    handleClose();
    callApi(); // Refresh the data after deletion
  };

  // Define the columns for the DataGrid
  const columns = [
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      renderCell: (params) => (
        <>
          <Link to={`/organizationBranchForm/${params.row.id}`}>
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
    { field: "branchName", headerName: "Branch Name", flex: 2 },
    { field: "organization", headerName: "Organization", flex: 2 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "telePhone", headerName: "Telephone", flex: 2 },
  ];

  // Map orgData to rows for the DataGrid
  const rows = orgData.map((org) => ({
    id: org._id,
    branchName: org.branchName,
    organization: org.organization.organizationName,
    email: org.email,
    telePhone: org.telePhone,
  }));
  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          ORGANIZATIONS BRANCH
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search by Branch Name"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
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
            to="/organizationBranchForm"
          >
            Add Branch
          </Button>
        </Box>
      </Box>
      <Paper
        sx={{
          width: "100%",
          marginTop: "2rem",
          height: "auto",
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
        fieldName="organizationBranchForm"
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

export default OrganizationBranchTable;
