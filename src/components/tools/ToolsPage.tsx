import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
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

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const [showFriendsList, setShowFriendsList] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleToolChange = async (value: string) => {
    try {
      setIsLoading(true);
      setSelectedTool(value);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Error changing tool:", error);
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
              >
                <TabsContent value="notes" className="m-0">
                  <NotesSection />
                </TabsContent>
                <TabsContent value="tasks" className="m-0">
                  <TasksSection />
                </TabsContent>
                <TabsContent value="calculator" className="m-0">
                  <CalculatorSection />
                </TabsContent>
                <TabsContent value="translator" className="m-0">
                  <TranslatorSection />
                </TabsContent>
                <TabsContent value="chess" className="m-0">
                  <ChessSection />
                </TabsContent>
              </motion.div>
            )}
          </motion.div>
        </Tabs>
      </div>

      <DashboardFriendsList
        show={showFriendsList}
        onClose={() => setShowFriendsList(false)}
      />

      <nav className="sticky bottom-0 left-0 right-0 z-[98] bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto py-2">
          <DashboardNavigation 
            currentPage={5}
            onPageChange={(page) => navigate(page === 5 ? "/tools" : "/")}
            isEditing={false}
          />
        </div>
      </nav>
    </div>
  );
}