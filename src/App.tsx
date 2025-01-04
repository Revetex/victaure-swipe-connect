import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { session } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard if authenticated, otherwise to auth */}
        <Route 
          path="/" 
          element={
            session ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        
        {/* Auth route */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected dashboard route */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;