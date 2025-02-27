
import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { WalletPage } from "./components/wallet/WalletPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/" element={<ProtectedRoute />} />
      
      {/* Route protégée pour l'application */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route index element={<DashboardLayout />} />
      </Route>
      
      {/* Route pour le portefeuille */}
      <Route 
        path="/wallet" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <WalletPage />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
