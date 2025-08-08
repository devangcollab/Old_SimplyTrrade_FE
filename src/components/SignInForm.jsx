import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { toast } from "react-toastify";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        `http://${api_call}/api/userLogIn`,
        formData
      );

      // Assuming the API returns a token
      const token = response.data.token;
      const role = response.data.role;
      localStorage.setItem("token", token); // Store token for authentication
      localStorage.setItem("role", JSON.stringify(role)); // Store token for authentication

      setMessage("Login successful! Redirecting...");
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect after login
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials!");
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
      <Typography
        variant="body2"
        textAlign="center"
        color="textSecondary"
        gutterBottom
      >
        Welcome back! Please enter your credentials.
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
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Sign In
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <a href="/" style={{ textDecoration: "none", color: "#3f51b5" }}>
          Sign Up
        </a>
      </Typography>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        SignIn with Otp?{" "}
        <a
          href="/signInByOtp"
          style={{ textDecoration: "none", color: "#3f51b5" }}
        >
          otp
        </a>
      </Typography>
    </Box>
  );
};

export default SigninForm;
