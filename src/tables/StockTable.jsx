import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../components/DeleteDialog";
import { deleteStock, getAllStocks } from "../apis/StockApi";
import StockDialog from "../components/StockDialog";
import PaymentDialog from "../components/PaymentDialog";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import noDataImage from "../assets/Group 18992.png";

const StockTable = ({ searchTerm , setStock , columns , rows , setLoginUser}) => {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [paymentDialog, setPaymentDialog] = React.useState(false);
  // const [stock, setStock] = React.useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // const [loginUser, setLoginUser] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Function to fetch data from the API based on pagination model
  const callApi = async () => {
    try {
      const response = await getAllStocks(
        paginationModel.page + 1,
        paginationModel.pageSize,
        searchTerm
      ); // +1 because API uses 1-based indexing
      setStock(response.data.data.items); // Set the items to orgData
      setTotalRows(response.data.data.totalCount); // Set the total count (rowCount) from API response
      setLoginUser(JSON.parse(localStorage.getItem("role")));
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

  const handleOpen = (data) => {
    setData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPaymentDialog(false); // Ensuring PaymentDialog closes separately
  };

  const openDeleteDialog = (id) => {
    setDeleteOpen(id);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    callApi();
  };

  const handlePaymentDialogOpen = (data) => {
    setData(data);
    setPaymentDialog(true);
  };

  const handleDelete = async (id) => {
    deleteStock(id);

    setDeleteOpen(false);
    handleClose();
    callApi();
  };

  // const columns = [
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     flex: 1.5,
  //     renderCell: (params) => (
  //       <>
  //         {((loginUser && loginUser.role === "admin") ||
  //           params?.row?.branchName === loginUser?.orgBranch?.branchName) && (
  //           <>
  //             <Link to={`/stockForm/${params.row.id}`}>
  //               <Tooltip title="Edit">
  //                 <IconButton>
  //                   <EditIcon sx={{ color: "#6c5ce7" }} />
  //                 </IconButton>
  //               </Tooltip>
  //             </Link>
  //             <Tooltip title="Delete">
  //               <IconButton onClick={() => openDeleteDialog(params.row.id)}>
  //                 <DeleteIcon sx={{ color: "#6c5ce7" }} />
  //               </IconButton>
  //             </Tooltip>
  //             <Link
  //               to={
  //                 location.pathname.includes("stockPage")
  //                   ? `/stockPage/expenseForm/${params.row.id}`
  //                   : `/expenseForm/${params.row.id}`
  //               }
  //             >
  //               <Tooltip title="Expense">
  //                 <IconButton>
  //                   <AccountBalanceWalletIcon sx={{ color: "#6c5ce7" }} />
  //                 </IconButton>
  //               </Tooltip>
  //             </Link>
  //             <Link
  //               to={
  //                 location.pathname.includes("stockPage")
  //                   ? `/stockPage/sellForm/${params.row.id}`
  //                   : `/sellFoflex : 1ms.row.id}`
  //               }
  //             >
  //               <Tooltip title="Sell">
  //                 <IconButton>
  //                   <MobileFriendlyIcon sx={{ color: "#6c5ce7" }} />
  //                 </IconButton>
  //               </Tooltip>
  //             </Link>
  //           </>
  //         )}
  //       </>
  //     ),
  //   },
  //   { field: "organization", headerName: "organization", flex: 1 },
  //   { field: "branchName", headerName: "Branch", flex: 1 },
  //   { field: "categoryId", headerName: "Category", flex: 1 },
  //   { field: "modelId", headerName: "Model", flex: 1 },
  //   { field: "deviceId", headerName: "Device", flex: 1 },
  //   { field: "totalAmount", headerName: "Stock Amount", flex: 1 },
  //   { field: "expenseAmount", headerName: "Expenses Amount", flex: 1.5 },
  //   { field: "total", headerName: "Total", flex: 1 },
  // ];

  // // Prepare the rows for the DataGrid
  // const rows = Array.isArray(stock)
  //   ? stock.map((stock) => ({
  //       id: stock._id,
  //       organization: stock?.organization?.organizationName,
  //       branchName: stock?.branch?.branchName,
  //       categoryId: stock?.categoryName?.categoryName,
  //       modelId: stock?.modelName?.modelName,
  //       deviceId: stock?.deviceName?.deviceName,
  //       totalAmount: stock?.totalAmount || "N/A",
  //       expenseAmount: stock?.expenseAmount || "N/A",
  //       total: stock?.expenseAmount
  //         ? stock?.totalAmount + stock?.expenseAmount
  //         : stock?.totalAmount || "N/A",
  //     }))
  //   : [];

  // Handle search term change

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
    <>
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
      <StockDialog
        handleClose={handleClose}
        open={open}
        data={data}
        callApi={callApi}
        fieldName="stockForm"
      />
      <PaymentDialog
        handleClose={handleClose}
        open={paymentDialog}
        data={data}
        callApi={callApi}
        fieldName="paymentForm"
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

export default StockTable;
