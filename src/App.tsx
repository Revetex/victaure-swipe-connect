
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
