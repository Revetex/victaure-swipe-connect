import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./layouts/AuthLayout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { VCardPage } from "./pages/VCardPage";
import { Marketplace } from "./components/Marketplace";
import { Tools } from "./pages/Tools";
import { Settings } from "./pages/Settings";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { WalletPage } from "./components/wallet/WalletPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/vcards/:username"
          element={
            <RequireAuth>
              <VCardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/marketplace"
          element={
            <RequireAuth>
              <DashboardLayout>
                <Marketplace />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/tools"
          element={
            <RequireAuth>
              <DashboardLayout>
                <Tools />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/wallet" element={
          <DashboardLayout>
            <WalletPage />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
