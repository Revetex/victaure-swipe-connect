import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import { PrivateRoute } from "./components/PrivateRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      {/* Catch all route - redirect to dashboard if authenticated, otherwise to auth */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}