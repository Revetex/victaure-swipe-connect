import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NotesSection } from "./sections/NotesSection";
import { TasksSection } from "./sections/TasksSection";
import { CalculatorSection } from "./sections/CalculatorSection";
import { TranslatorSection } from "./sections/TranslatorSection";
import { ChessSection } from "./sections/ChessSection";
import { NetworkSection } from "./sections/NetworkSection";
import { MenuSection } from "./sections/MenuSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ListTodo, StickyNote, Calculator, Languages, Sword, Menu, Network } from "lucide-react";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleToolChange = async (value: string) => {
    try {
      setIsLoading(true);
      setSelectedTool(value);
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
                "transition-all duration-200 px-4 py-2 rounded-md flex items-center gap-2"
              )}
            >
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md flex items-center gap-2"
              )}
            >
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Tâches</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calculator"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md flex items-center gap-2"
              )}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculatrice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="translator"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md flex items-center gap-2"
              )}
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Traducteur</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chess"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md flex items-center gap-2"
              )}
            >
              <Sword className="h-4 w-4" />
              <span className="hidden sm:inline">Échecs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="menu"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md flex items-center gap-2"
              )}
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger 
              value="network"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200 px-4 py-2 rounded-md flex items-center gap-2"
              )}
            >
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Réseau</span>
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
                <TabsContent value="chess" className="h-full m-0">
                  <ChessSection />
                </TabsContent>
                <TabsContent value="menu" className="h-full m-0">
                  <MenuSection />
                </TabsContent>
                <TabsContent value="network" className="h-full m-0">
                  <NetworkSection />
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