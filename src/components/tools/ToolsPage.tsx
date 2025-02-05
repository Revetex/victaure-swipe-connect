import { useState } from "react";
import { NotesPage } from "./NotesPage";
import { TasksPage } from "./TasksPage";
import { CalculatorPage } from "./CalculatorPage";
import { TranslatorPage } from "./TranslatorPage";
import { ConverterPage } from "./ConverterPage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardNavigation } from "../dashboard/DashboardNavigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleReturn}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="notes" value={selectedTool} onValueChange={setSelectedTool} className="w-full">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto scrollbar-hide">
            <TabsTrigger 
              value="notes"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Notes
            </TabsTrigger>
            <TabsTrigger 
              value="tasks"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Tâches
            </TabsTrigger>
            <TabsTrigger 
              value="calculator"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Calculatrice
            </TabsTrigger>
            <TabsTrigger 
              value="translator"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Traducteur
            </TabsTrigger>
            <TabsTrigger 
              value="converter"
              className={cn(
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                "transition-all duration-200"
              )}
            >
              Convertisseur
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="notes">
              <NotesPage />
            </TabsContent>
            <TabsContent value="tasks">
              <TasksPage />
            </TabsContent>
            <TabsContent value="calculator">
              <CalculatorPage />
            </TabsContent>
            <TabsContent value="translator">
              <TranslatorPage />
            </TabsContent>
            <TabsContent value="converter">
              <ConverterPage />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
      
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40 shadow-lg"
        style={{ 
          height: '4rem',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <DashboardNavigation currentPage={5} onPageChange={() => {}} />
        </div>
      </motion.nav>
    </div>
  );
}