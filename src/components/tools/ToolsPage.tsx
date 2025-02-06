
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotesPage } from "./NotesPage";
import { TasksPage } from "./TasksPage";
import { CalculatorPage } from "./CalculatorPage";
import { TranslatorPage } from "./TranslatorPage";
import { ChessPage } from "./ChessPage";
import { ToolsNavigation } from "./navigation/ToolsNavigation";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tool = "notes" | "tasks" | "calculator" | "translator" | "chess" | "converter";

export function ToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>("notes");
  const [toolsOrder, setToolsOrder] = useState<Tool[]>([
    "notes",
    "tasks",
    "calculator",
    "translator",
    "chess",
    "converter"
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
          .from('profiles')
          .select('tools_order, last_used_tool')
          .eq('id', user.id)
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
        .from('profiles')
        .update({ last_used_tool: newActiveTool })
        .eq('id', user.id);
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
    toast.success("Outil fermé");
  };

  const toolComponents = {
    notes: NotesPage,
    tasks: TasksPage,
    calculator: CalculatorPage,
    translator: TranslatorPage,
    chess: ChessPage,
    converter: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Convertisseur (Bientôt disponible)</p>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  };

  const ActiveComponent = toolComponents[activeTool];

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b">
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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 relative"
        >
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-full pt-10">
            <ActiveComponent />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
