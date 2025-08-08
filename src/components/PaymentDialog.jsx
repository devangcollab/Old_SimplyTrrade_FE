import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PaymentDialog = ({ open, handleClose }) => {
  const [account, setAccount] = useState("SBI");
  const [organization, setOrganization] = useState("Collab Softech");

  return (
    <Dialog open={open} handleClose={handleClose} maxWidth="md" fullWidth>
      {/* Title Bar */}
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f3d56" }}>
          PAYMENTS
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 16, top: 16, color: "red" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Form Content */}
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Total Amount"
              fullWidth
              variant="outlined"
              value="30000"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Paid to Customer"
              fullWidth
              variant="outlined"
              value="10000"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Remaining Amount"
              fullWidth
              variant="outlined"
              value="20000"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Select an Organization"
              fullWidth
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            >
              <MenuItem value="Collab Softech">Collab Softech</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Select an Account"
              fullWidth
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              <MenuItem value="SBI">SBI</MenuItem>
              <MenuItem value="ICICI">ICICI</MenuItem>
              <MenuItem value="State Bank of India">
                State Bank of India
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Payment Amount" fullWidth variant="outlined" />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Action Buttons */}
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
