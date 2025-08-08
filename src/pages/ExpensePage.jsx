import React from "react";
import ExpenseTable from "../tables/ExpenseTable";
import { Box } from "@mui/material";

const ExpensePage = () => {
  return (
    <div>
      <Box>
        <ExpenseTable />
      </Box>
    </div>
  );
};

export default ExpensePage;
