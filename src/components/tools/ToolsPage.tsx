import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { ToolsHeader } from "./layout/ToolsHeader";
import { ToolsContent } from "./layout/ToolsContent";
import { ToolsNavigation } from "./layout/ToolsNavigation";

export function ToolsPage() {
  const { toolId } = useParams();
  const [selectedTool, setSelectedTool] = useState(toolId || "notes");
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (toolId) {
      setSelectedTool(toolId);
    }
  }, [toolId]);

  useEffect(() => {
    const loadLastUsedTool = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('last_used_tool')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile?.last_used_tool && !toolId) {
          setSelectedTool(profile.last_used_tool);
          navigate(`/dashboard/tools/${profile.last_used_tool}`);
        }
      } catch (error) {
        console.error("Error loading tool preferences:", error);
      }
    };

    loadLastUsedTool();
  }, [navigate, toolId]);

  const handleToolChange = async (value: string) => {
    try {
      setIsLoading(true);
      setSelectedTool(value);
      navigate(`/dashboard/tools/${value}`);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            last_used_tool: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error("Error updating tool preference:", updateError);
          toast.error("Erreur lors de la mise à jour des préférences");
        }
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Error changing tool:", error);
      toast.error("Erreur lors du changement d'outil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ToolsHeader 
        showFriendsList={showFriendsList}
        onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
      />

      <AnimatePresence mode="wait">
        {showFriendsList && (
          <DashboardFriendsList 
            show={showFriendsList} 
            onClose={() => setShowFriendsList(false)}
          />
        )}
      </AnimatePresence>

      <ToolsContent 
        selectedTool={selectedTool}
        isLoading={isLoading}
        onToolChange={handleToolChange}
      />

      <ToolsNavigation />
    </div>
  );
}