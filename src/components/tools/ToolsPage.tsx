
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
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  const navigate = useNavigate();

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

  const handleClose = () => {
    navigate('/dashboard');
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
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ToolsNavigation
          activeTool={activeTool}
          onToolChange={handleToolChange}
          toolsOrder={toolsOrder}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="ml-2"
          title="Fermer"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderActiveTool()}
      </div>
    </div>
  );
}
