import { useState } from "react";
import { NotesPage } from "./NotesPage";
import { TasksPage } from "./TasksPage";
import { CalculatorPage } from "./CalculatorPage";
import { TranslatorPage } from "./TranslatorPage";
import { ConverterPage } from "./ConverterPage";
import { ChessPage } from "./ChessPage";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
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
        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="tasks">Tâches</TabsTrigger>
            <TabsTrigger value="calculator">Calculatrice</TabsTrigger>
            <TabsTrigger value="translator">Traducteur</TabsTrigger>
            <TabsTrigger value="converter">Convertisseur</TabsTrigger>
            <TabsTrigger value="chess">Échecs</TabsTrigger>
          </TabsList>

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
          <TabsContent value="chess">
            <ChessPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}