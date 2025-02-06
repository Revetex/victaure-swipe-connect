import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotesPage } from "./NotesPage";
import { TasksPage } from "./TasksPage";
import { CalculatorPage } from "./CalculatorPage";
import { TranslatorPage } from "./TranslatorPage";
import { ChessPage } from "./ChessPage";
import { ToolsNavigation } from "./navigation/ToolsNavigation";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

type Tool = "notes" | "tasks" | "calculator" | "translator" | "chess";

export function ToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>("notes");
  const [toolsOrder, setToolsOrder] = useState<Tool[]>([
    "notes",
    "tasks",
    "calculator",
    "translator",
    "chess",
  ]);

  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Vous devez être connecté pour accéder à vos outils");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("tools_order, last_used_tool")
          .eq("id", user.id)
          .single();

        if (profile?.tools_order) {
          setToolsOrder(profile.tools_order as Tool[]);
        }
        if (profile?.last_used_tool) {
          setActiveTool(profile.last_used_tool as Tool);
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
        toast.error("Erreur lors du chargement de vos préférences");
      }
    };

    loadUserPreferences();
  }, []);

  const updateUserPreferences = async (newActiveTool: Tool) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("profiles")
        .update({ last_used_tool: newActiveTool })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error updating user preferences:", error);
    }
  };

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    updateUserPreferences(tool);
  };

  const renderActiveTool = () => {
    switch (activeTool) {
      case "notes":
        return <NotesPage />;
      case "tasks":
        return <TasksPage />;
      case "calculator":
        return <CalculatorPage />;
      case "translator":
        return <TranslatorPage />;
      case "chess":
        return <ChessPage />;
      default:
        return <NotesPage />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ToolsNavigation
        activeTool={activeTool}
        onToolChange={handleToolChange}
        toolsOrder={toolsOrder}
      />
      <div className="flex-1 overflow-hidden">
        {renderActiveTool()}
      </div>
    </div>
  );
}