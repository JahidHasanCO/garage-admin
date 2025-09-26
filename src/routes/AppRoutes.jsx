import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import Dashboard from "../pages/Dashboard/DashboardPage";
import { useAuth } from "../contexts/useAuthContext";

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
