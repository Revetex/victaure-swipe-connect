
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ToolsNavigation } from "./navigation/ToolsNavigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useViewport } from "@/hooks/useViewport";

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
  
  const { viewportHeight } = useViewport();
  
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
    <div className="relative h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea 
        className="h-[calc(100vh-4rem)]"
        style={{ height: `${viewportHeight - 64}px` }}
      >
        <div className="p-4 space-y-4">
          <ToolsNavigation
            activeTool={activeTool}
            onToolChange={handleToolChange}
            toolsOrder={toolsOrder}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
