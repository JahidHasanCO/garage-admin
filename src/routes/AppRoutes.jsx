import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import PartsPage from "../pages/Parts/PartsPage";
import AddEditPartPage from "../pages/Parts/AddEditPartPage";
import FuelTypesPage from "../pages/FuelTypes/FuelTypesPage";
import AddEditFuelTypePage from "../pages/FuelTypes/AddEditFuelTypePage";
import ManufacturersPage from "../pages/Manufacturers/ManufacturersPage";
import AddEditManufacturerPage from "../pages/Manufacturers/AddEditManufacturerPage";
import VehiclesPage from "../pages/Vehicles/VehiclesPage";
import AddEditVehiclePage from "../pages/Vehicles/AddEditVehiclePage";
import ServicesPage from "../pages/Services/ServicesPage";
import AddEditServicePage from "../pages/Services/AddEditServicePage";
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
      <Route
        path={RouteNames.MANUFACTURERS}
        element={token ? <DashboardLayout /> : <Navigate to={RouteNames.LOGIN} replace />}
      >
        <Route index element={<ManufacturersPage />} />
        <Route path="add" element={<AddEditManufacturerPage />} />
        <Route path="edit/:id" element={<AddEditManufacturerPage />} />
      </Route>
      <Route
        path={RouteNames.VEHICLES}
        element={token ? <DashboardLayout /> : <Navigate to={RouteNames.LOGIN} replace />}
      >
        <Route index element={<VehiclesPage />} />
        <Route path="add" element={<AddEditVehiclePage />} />
        <Route path="edit/:id" element={<AddEditVehiclePage />} />
      </Route>
      <Route
        path={RouteNames.SERVICES}
        element={token ? <DashboardLayout /> : <Navigate to={RouteNames.LOGIN} replace />}
      >
        <Route index element={<ServicesPage />} />
        <Route path="add" element={<AddEditServicePage />} />
        <Route path="edit/:id" element={<AddEditServicePage />} />
      </Route>
      <Route path="/" element={<Navigate to={RouteNames.DASHBOARD} replace />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
