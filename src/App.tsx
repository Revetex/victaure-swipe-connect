import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ToolsPage } from "@/components/tools/ToolsPage";
import { NotesPage } from "@/components/tools/NotesPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { ConverterPage } from "@/components/tools/ConverterPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/tools" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
        <Route path="/dashboard/tools/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
        <Route path="/dashboard/tools/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        <Route path="/dashboard/tools/calculator" element={<ProtectedRoute><CalculatorPage /></ProtectedRoute>} />
        <Route path="/dashboard/tools/translator" element={<ProtectedRoute><TranslatorPage /></ProtectedRoute>} />
        <Route path="/dashboard/tools/converter" element={<ProtectedRoute><ConverterPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}