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
import { ToolsNavigation } from "./navigation/ToolsNavigation";

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
        <Tabs 
          defaultValue="notes" 
          value={selectedTool} 
          onValueChange={setSelectedTool} 
          className="w-full"
        >
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
            className="h-[calc(100vh-16rem)]"
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
          </motion.div>
        </Tabs>
      </div>
      
      <ToolsNavigation />
    </div>
  );
}