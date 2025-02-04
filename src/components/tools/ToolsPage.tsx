import { useState } from "react";
import { NotesToolSelector } from "@/components/notes/NotesToolSelector";
import { NotesPage } from "./NotesPage";
import { TasksPage } from "./TasksPage";
import { CalculatorPage } from "./CalculatorPage";
import { TranslatorPage } from "./TranslatorPage";
import { ConverterPage } from "./ConverterPage";
import { ChessPage } from "./ChessPage";
import { SwipeJob } from "@/components/SwipeJob";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <NotesToolSelector
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
        />
      </div>

      <div className="flex-1 overflow-auto">
        {selectedTool === "notes" && <NotesPage />}
        {selectedTool === "tasks" && <TasksPage />}
        {selectedTool === "calculator" && <CalculatorPage />}
        {selectedTool === "translator" && <TranslatorPage />}
        {selectedTool === "converter" && <ConverterPage />}
        {selectedTool === "chess" && <ChessPage />}
        {selectedTool === "jobs" && <SwipeJob />}
      </div>
    </div>
  );
}