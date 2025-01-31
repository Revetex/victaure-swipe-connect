import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="fixed top-4 left-4 z-50">
        <ThemeToggle />
      </div>
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.location.href = '/settings'}
          className="border-orange-500/20"
        >
          <SettingsIcon className="h-4 w-4 text-orange-500" />
        </Button>
      </div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;