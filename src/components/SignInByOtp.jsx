import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignInByOtp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    rememberMe: false,
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const api_call = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post(
        `${api_call}/sendOtp`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/otpPage");
      }, 1500);
      localStorage.setItem("email", formData.email);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
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
        Sign In
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          variant="outlined"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Get OTP
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Sign In with Password?{" "}
        <a href="/signIn" style={{ textDecoration: "none", color: "#3f51b5" }}>
          Sign in
        </a>
      </Typography>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <a href="/" style={{ textDecoration: "none", color: "#3f51b5" }}>
          Sign Up
        </a>
      </Typography>
    </Box>
  );
};

export default SignInByOtp;
