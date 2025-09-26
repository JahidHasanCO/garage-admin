import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import PartsPage from "../pages/Parts/PartsPage";
import AddEditPartPage from "../pages/Parts/AddEditPartPage";
import { useAuth } from "../contexts/useAuthContext";
import { RouteNames } from "./RouteNames";

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route 
        path={RouteNames.LOGIN} 
        element={token ? <Navigate to={RouteNames.DASHBOARD} /> : <LoginPage />} 
      />
      <Route
        path="/dashboard"
        element={token ? <DashboardLayout /> : <Navigate to={RouteNames.LOGIN} />}
      >
        <Route index element={<DashboardHome />} />
        <Route path="parts" element={<PartsPage />} />
        <Route path="parts/add" element={<AddEditPartPage />} />
        <Route path="parts/edit/:id" element={<AddEditPartPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
