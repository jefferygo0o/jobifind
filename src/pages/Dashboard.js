// src/pages/Dashboard.js
import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleLogout}
        >
          Logout
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/job-search"
        >
          Go to Job Search
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
