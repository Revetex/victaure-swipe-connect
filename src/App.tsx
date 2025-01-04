import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <div className="min-h-screen w-full overflow-y-auto">
            <Routes>
              {/* Redirect root to dashboard if authenticated, otherwise to auth */}
              <Route 
                path="/" 
                element={
                  isAuthenticated ? (
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
            <Toaster position="top-right" expand={false} richColors />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;