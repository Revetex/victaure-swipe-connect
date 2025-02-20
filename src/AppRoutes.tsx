
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DashboardLayout } from "./components/DashboardLayout";
import { AuthCallback } from "./components/AuthCallback";
import { Feed } from "./components/feed/Feed";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Feed />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
