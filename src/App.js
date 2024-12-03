import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage"; // Login page component
import SignupPage from "./pages/SignupPage";       // Home page component
import Dashboard from "./pages/Dashboard";    // Example dashboard page

function App() {
  return (
    <Router>
      <div>
        {/* Define routes for your app */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
