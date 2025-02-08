
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ToolsNavigation } from "./navigation/ToolsNavigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useViewport } from "@/hooks/useViewport";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  const [isLoading, setIsLoading] = useState(false);
  const { viewportHeight } = useViewport();
  const navigate = useNavigate();
  
  const loadUserPreferences = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour accéder à vos préférences");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('last_used_tool, tools_order')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        if (profile.last_used_tool) {
          setActiveTool(profile.last_used_tool as Tool);
        }
        if (profile.tools_order) {
          setToolsOrder(profile.tools_order as Tool[]);
        }
      }
    } catch (error) {
      console.error("Error loading user preferences:", error);
      toast.error("Erreur lors du chargement des préférences");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToolChange = async (tool: Tool) => {
    try {
      setActiveTool(tool);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour sauvegarder vos préférences");
        return;
      }

      // Naviguer directement vers l'outil spécifique
      switch (tool) {
        case "notes":
          navigate("/notes");
          break;
        case "tasks":
          navigate("/tasks");
          break;
        case "calculator":
          navigate("/calculator");
          break;
        case "translator":
          navigate("/translator");
          break;
        case "chess":
          navigate("/chess");
          break;
        case "converter":
          navigate("/converter");
          break;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          last_used_tool: tool,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating user preferences:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  const handleReorderTools = async (newOrder: Tool[]) => {
    try {
      setToolsOrder(newOrder);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour sauvegarder l'ordre des outils");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          tools_order: newOrder,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success("Ordre des outils mis à jour");
    } catch (error) {
      console.error("Error updating tools order:", error);
      toast.error("Erreur lors de la mise à jour de l'ordre des outils");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <ScrollArea 
        className="h-[calc(100vh-8rem)] mt-16"
        style={{ height: `${viewportHeight - 128}px` }}
      >
        <div className="container mx-auto py-4 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ToolsNavigation
                activeTool={activeTool}
                onToolChange={handleToolChange}
                toolsOrder={toolsOrder}
                onReorderTools={handleReorderTools}
                isLoading={isLoading}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
