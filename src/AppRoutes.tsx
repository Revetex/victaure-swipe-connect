
import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import { WalletPage } from "./components/wallet/WalletPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route principale */}
      <Route path="/" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      } />
      
      {/* Route pour le portefeuille */}
      <Route 
        path="/wallet" 
        element={
          <PrivateRoute>
            <DashboardLayout>
              <WalletPage />
            </DashboardLayout>
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}
