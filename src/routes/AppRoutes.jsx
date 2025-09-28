import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import PartsPage from "../pages/Parts/PartsPage";
import AddEditPartPage from "../pages/Parts/AddEditPartPage";
import FuelTypesPage from "../pages/FuelTypes/FuelTypesPage";
import AddEditFuelTypePage from "../pages/FuelTypes/AddEditFuelTypePage";
import { useAuth } from "../contexts/useAuthContext";
import { RouteNames } from "./RouteNames";

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path={RouteNames.LOGIN}
        element={token ? <Navigate to={RouteNames.DASHBOARD} replace /> : <LoginPage />}
      />
      <Route
        path={RouteNames.DASHBOARD}
        element={token ? <DashboardLayout /> : <Navigate to={RouteNames.LOGIN} replace />}
      >
        <Route index element={<DashboardHome />} />
      </Route>
      <Route
        path={RouteNames.PARTS}
        element={token ? <DashboardLayout /> : <Navigate to={RouteNames.LOGIN} replace />}
      >
        <Route index element={<PartsPage />} />
        <Route path="add" element={<AddEditPartPage />} />
        <Route path="edit/:id" element={<AddEditPartPage />} />
      </Route>
      <Route
        path={RouteNames.FUEL_TYPES}
        element={token ? <DashboardLayout /> : <Navigate to={RouteNames.LOGIN} replace />}
      >
        <Route index element={<FuelTypesPage />} />
        <Route path="add" element={<AddEditFuelTypePage />} />
        <Route path="edit/:id" element={<AddEditFuelTypePage />} />
      </Route>
      <Route path="/" element={<Navigate to={RouteNames.DASHBOARD} replace />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
