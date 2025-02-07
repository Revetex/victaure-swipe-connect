
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ToolsNavigation } from "./navigation/ToolsNavigation";

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
