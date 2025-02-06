import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NotesSection } from "./sections/NotesSection";
import { TasksSection } from "./sections/TasksSection";
import { CalculatorSection } from "./sections/CalculatorSection";
import { TranslatorSection } from "./sections/TranslatorSection";
import { ConverterSection } from "./sections/ConverterSection";
import { ChessSection } from "./sections/ChessSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleToolChange = async (value: string) => {
    try {
      setIsLoading(true);
      setSelectedTool(value);
      // Simulate loading for smoother transitions
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      toast.error("Erreur lors du changement d'outil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <DashboardHeader 
        title="Outils"
        showFriendsList={showFriendsList}
        onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
        isEditing={false}
      />

      <div className="flex-1 overflow-auto p-4">
        <Tabs 
          defaultValue="notes" 
          value={selectedTool} 
          onValueChange={handleToolChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-4 overflow-x-auto flex p-1 gap-2">
            <TabsTrigger 
              value="notes"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md"
              )}
            >
              Notes
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md"
              )}
            >
              Tâches
            </TabsTrigger>
            <TabsTrigger 
              value="calculator"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md"
              )}
            >
              Calculatrice
            </TabsTrigger>
            <TabsTrigger 
              value="translator"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md"
              )}
            >
              Traducteur
            </TabsTrigger>
            <TabsTrigger 
              value="converter"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md"
              )}
            >
              Convertisseur
            </TabsTrigger>
            <TabsTrigger 
              value="chess"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md"
              )}
            >
              Échecs
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-[calc(100vh-12rem)]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <ReloadIcon className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <TabsContent value="notes" className="h-full m-0">
                  <NotesSection />
                </TabsContent>
                <TabsContent value="tasks" className="h-full m-0">
                  <TasksSection />
                </TabsContent>
                <TabsContent value="calculator" className="h-full m-0">
                  <CalculatorSection />
                </TabsContent>
                <TabsContent value="translator" className="h-full m-0">
                  <TranslatorSection />
                </TabsContent>
                <TabsContent value="converter" className="h-full m-0">
                  <ConverterSection />
                </TabsContent>
                <TabsContent value="chess" className="h-full m-0">
                  <ChessSection />
                </TabsContent>
              </>
            )}
          </motion.div>
        </Tabs>
      </div>

      <nav className="sticky bottom-0 left-0 right-0 z-[98] bg-background/95 backdrop-blur border-t">
        <div className="container mx-auto py-2">
          <DashboardNavigation 
            currentPage={5}
            onPageChange={() => {}}
            isEditing={false}
          />
        </div>
      </nav>
    </div>
  );
}