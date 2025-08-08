import * as React from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StockTable from "../tables/StockTable";
import { Link } from "react-router-dom";
import AddStockViaExcel from "../components/excelViseStockAdd/AddStockViaExcel";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../components/DeleteDialog";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StockPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [stock, setStock] = React.useState([]);
    const [loginUser, setLoginUser] = React.useState({});


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


    const columns = [
    {
      field: "action",
      headerName: "Action",
      flex: 1.5,
      renderCell: (params) => (
        <>
          {((loginUser && loginUser.role === "admin") ||
            params?.row?.branchName === loginUser?.orgBranch?.branchName) && (
            <>
              <Link to={`/stockForm/${params.row.id}`}>
                <Tooltip title="Edit">
                  <IconButton>
                    <EditIcon sx={{ color: "#6c5ce7" }} />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Delete">
                <IconButton onClick={() => openDeleteDialog(params.row.id)}>
                  <DeleteIcon sx={{ color: "#6c5ce7" }} />
                </IconButton>
              </Tooltip>
              <Link
                to={
                  location.pathname.includes("stockPage")
                    ? `/stockPage/expenseForm/${params.row.id}`
                    : `/expenseForm/${params.row.id}`
                }
              >
                <Tooltip title="Expense">
                  <IconButton>
                    <AccountBalanceWalletIcon sx={{ color: "#6c5ce7" }} />
                  </IconButton>
                </Tooltip>
              </Link>
              <Link
                to={
                  location.pathname.includes("stockPage")
                    ? `/stockPage/sellForm/${params.row.id}`
                    : `/sellFoflex : 1ms.row.id}`
                }
              >
                <Tooltip title="Sell">
                  <IconButton>
                    <MobileFriendlyIcon sx={{ color: "#6c5ce7" }} />
                  </IconButton>
                </Tooltip>
              </Link>
            </>
          )}
        </>
      ),
    },
    { field: "organization", headerName: "organization", flex: 1 },
    { field: "branchName", headerName: "Branch", flex: 1 },
    { field: "categoryId", headerName: "Category", flex: 1 },
    { field: "modelId", headerName: "Model", flex: 1 },
    { field: "deviceId", headerName: "Device", flex: 1 },
    { field: "totalAmount", headerName: "Stock Amount", flex: 1 },
    { field: "expenseAmount", headerName: "Expenses Amount", flex: 1.5 },
    { field: "total", headerName: "Total", flex: 1 },
  ];

  // Prepare the rows for the DataGrid
  const rows = Array.isArray(stock)
    ? stock.map((stock) => ({
        id: stock._id,
        organization: stock?.organization?.organizationName,
        branchName: stock?.branch?.branchName,
        categoryId: stock?.categoryName?.categoryName,
        modelId: stock?.modelName?.modelName,
        deviceId: stock?.deviceName?.deviceName,
        totalAmount: stock?.totalAmount || "N/A",
        expenseAmount: stock?.expenseAmount || "N/A",
        total: stock?.expenseAmount
          ? stock?.totalAmount + stock?.expenseAmount
          : stock?.totalAmount || "N/A",
      }))
    : [];


  const handleDownloadExcel = () => {
  const visibleColumns = columns.filter((col) => col.field !== "action");
 
  const exportData = rows.map((row) =>
    visibleColumns.reduce((acc, col) => {
      acc[col.headerName] = row[col.field] ?? "";
      return acc;
    }, {})
  );
 
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");
 
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
 
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
 
  saveAs(data, "location_data.xlsx");
};


  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6c5ce7" }}>
          STOCK
        </Typography>
          
        <AddStockViaExcel />

        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            placeholder="Search by Model"
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
          <Grid item xs={2} sm={6} md={4}>
            <Button
              sx={{
                color: "#2C2B7E",
                gap: "0.5rem",
                backgroundColor: "white",
                borderRadius: "0.3rem",
                border: "1px solid #2C2B7E",
                "&:hover": {
                  backgroundColor: "#2C2B7E",
                  color: "white",
                },
              }}
              onClick={handleDownloadExcel}
            >
              excel
              <DescriptionOutlinedIcon
                sx={{
                  color: "inherit",
                }}
              />
              {/* <FaFileExcel  sx={{ color: "#2C2B7E" }} /> */}
            </Button>
          </Grid>
          <Button
            variant="outlined"
            sx={{
              color: "#6c5ce7",
              borderColor: "#6c5ce7",
              textTransform: "none",
            }}
            component={Link}
            to="/stockForm"
          >
            Add Stock
          </Button>
        </Box>
      </Box>
      <Box>
        <StockTable searchTerm={searchTerm} setStock={setStock} columns={columns} rows={rows} setLoginUser={setLoginUser}/>
      </Box>
    </>
  );
};

export default StockPage;
