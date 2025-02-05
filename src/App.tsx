import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;