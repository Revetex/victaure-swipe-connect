import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
          <Toaster position="top-right" expand={false} richColors />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;