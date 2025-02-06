import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NotesSection } from "./sections/NotesSection";
import { TasksSection } from "./sections/TasksSection";
import { CalculatorSection } from "./sections/CalculatorSection";
import { TranslatorSection } from "./sections/TranslatorSection";
import { ConverterSection } from "./sections/ConverterSection";
import { ChessSection } from "./sections/ChessSection";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReturn}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-xl font-semibold">Outils</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs 
          defaultValue="notes" 
          value={selectedTool} 
          onValueChange={setSelectedTool} 
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
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}