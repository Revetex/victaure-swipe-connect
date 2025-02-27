
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { Marketplace } from "./components/Marketplace";
import { Messages } from "./components/Messages";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/messages" element={<Messages />} />
            {/* Plus de routes à ajouter ici */}
          </Route>
        </Routes>
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            duration: 5000,
            className: "backdrop-blur-sm border border-slate-200 dark:border-slate-700",
          }}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
