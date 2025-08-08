import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Stack } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const AddStockViaExcel = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an Excel file first!");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        `${api_call}/importExcel`, // Replace with your actual route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("File uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <Stack direction={"row"}>
      <Box>
      <Typography variant="h6" mb={1}>Upload Stock Excel File</Typography>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={!selectedFile}
        onClick={handleUpload}
      >
        Upload to DB
      </Button>
    </Stack>
  );
};

export default AddStockViaExcel;
