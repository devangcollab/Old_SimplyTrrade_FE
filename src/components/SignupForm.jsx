import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    keepLoggedIn: false,
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
        `http://${api_call}/api/userSignUp`,
        formData
      );
      setMessage("Registration successful! Please log in.");
      toast.success("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/signIn");
      }, 2000); // Redirect after 2 seconds
      navigate("/signIn");
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
        background: "#fff",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        textAlign="center"
        color="#4C2D85"
        fontWeight="bold"
      >
        Sign Up | Register
      </Typography>
      <Typography
        variant="body2"
        textAlign="center"
        color="textSecondary"
        gutterBottom
      >
        Welcome, create a new account
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter Your Name"
          fullWidth
          margin="normal"
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Enter Your Email"
          fullWidth
          margin="normal"
          variant="outlined"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Enter Your Mobile No"
          fullWidth
          margin="normal"
          variant="outlined"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
        />
        <TextField
          label="Enter Your Password"
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <FormControlLabel
          style={{ display: "flex", justifyContent: "center" }}
          control={
            <Checkbox
              name="keepLoggedIn"
              checked={formData.keepLoggedIn}
              onChange={handleChange}
            />
          }
          label="Keep me Logged in"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          style={{ backgroundColor: "#4C2D85" }}
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account? <a href="/signIn">Sign in</a>
      </Typography>
    </Box>
  );
};

export default SignupForm;
