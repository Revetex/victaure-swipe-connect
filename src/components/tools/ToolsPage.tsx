
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotesPage } from "./NotesPage";
import { TasksPage } from "./TasksPage";
import { CalculatorPage } from "./CalculatorPage";
import { TranslatorPage } from "./TranslatorPage";
import { ChessPage } from "./ChessPage";
import { ToolsNavigation } from "./navigation/ToolsNavigation";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

type Tool = "notes" | "tasks" | "calculator" | "translator" | "chess" | "converter";

export function ToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>("notes");
  const [toolsOrder] = useState<Tool[]>([
    "notes",
    "tasks",
    "calculator",
    "translator",
    "chess",
    "converter"
  ]);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    updateUserPreferences(tool);
  };

  const updateUserPreferences = async (newActiveTool: Tool) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ last_used_tool: newActiveTool })
        .eq('id', user.id);
    } catch (error) {
      console.error("Error updating user preferences:", error);
    }
  };

  return (
    <div className="p-4">
      <ToolsNavigation
        activeTool={activeTool}
        onToolChange={handleToolChange}
        toolsOrder={toolsOrder}
      />
    </div>
  );
}
