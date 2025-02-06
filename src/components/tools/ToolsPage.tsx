import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { NotesSection } from "./sections/NotesSection";
import { TasksSection } from "./sections/TasksSection";
import { CalculatorSection } from "./sections/CalculatorSection";
import { TranslatorSection } from "./sections/TranslatorSection";
import { ChessSection } from "./sections/ChessSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const [showFriendsList, setShowFriendsList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load user's last used tool from profile
  useEffect(() => {
    const loadLastUsedTool = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('last_used_tool, tools_order')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile?.last_used_tool) {
          setSelectedTool(profile.last_used_tool);
        }
      } catch (error) {
        console.error("Error loading tool preferences:", error);
      }
    };

    loadLastUsedTool();
  }, []);

  // Set up real-time subscription for tool updates
  useEffect(() => {
    let mounted = true;

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel('tools-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            if (mounted && payload.new.last_used_tool) {
              setSelectedTool(payload.new.last_used_tool);
            }
          }
        )
        .subscribe();

      return () => {
        mounted = false;
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, []);

  const handleToolChange = async (value: string) => {
    try {
      setIsLoading(true);
      setSelectedTool(value);

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
      <DashboardHeader 
        title="Outils"
        showFriendsList={showFriendsList}
        onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
        isEditing={false}
      />

      <AnimatePresence mode="wait">
        {showFriendsList && (
          <DashboardFriendsList 
            show={showFriendsList} 
            onClose={() => setShowFriendsList(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 container mx-auto px-4 py-4">
        <Tabs 
          defaultValue="notes" 
          value={selectedTool} 
          onValueChange={handleToolChange}
          className="w-full space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 relative"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
                <ReloadIcon className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-[calc(100vh-16rem)] overflow-y-auto"
              >
                <TabsContent value="notes" className="m-0 h-full">
                  <NotesSection />
                </TabsContent>
                <TabsContent value="tasks" className="m-0 h-full">
                  <TasksSection />
                </TabsContent>
                <TabsContent value="calculator" className="m-0 h-full">
                  <CalculatorSection />
                </TabsContent>
                <TabsContent value="translator" className="m-0 h-full">
                  <TranslatorSection />
                </TabsContent>
                <TabsContent value="chess" className="m-0 h-full">
                  <ChessSection />
                </TabsContent>
              </motion.div>
            )}
          </motion.div>
        </Tabs>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-[98] bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto py-2">
          <DashboardNavigation 
            currentPage={5}
            onPageChange={(page) => {
              if (page !== 5) {
                navigate('/dashboard');
              }
            }}
            isEditing={false}
          />
        </div>
      </nav>
    </div>
  );
}