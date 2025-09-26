import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import Dashboard from "../pages/Dashboard/DashboardPage";
import { useAuth } from "../contexts/useAuthContext";
import {RouteNames} from "./RouteNames";

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route 
        path={RouteNames.LOGIN} 
        element={token ? <Navigate to={RouteNames.DASHBOARD} /> : <LoginPage />} 
      />
      <Route
        path={RouteNames.DASHBOARD}
        element={token ? <Dashboard /> : <Navigate to={RouteNames.LOGIN} />}
      />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
