import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpForm = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const api_call = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${api_call}/verifyOtp`,
        { email: localStorage.getItem("email"), code: otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // localStorage.setItem(`Bearer ${response}`);

      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ color: " #4C2D85" }}>
        ENTER OTP
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span style={{ width: "12px" }} />} // Increased spacing
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: "40px", // Increased width
                height: "40px", // Increased height
                fontSize: "1.5rem", // Increased font size
                textAlign: "center",
                border: "2px solid #ccc",
                borderRadius: "8px",
              }}
            />
          )}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Verify
      </Button>
      <Button type="submit" fullWidth sx={{ mt: 2 }}>
        Resend Otp
      </Button>
    </Box>
  );
};

export default OtpForm;
