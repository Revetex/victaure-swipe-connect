import { useState } from "react";
import { NotesToolSelector } from "@/components/notes/NotesToolSelector";
import { NotesPage } from "./NotesPage";
import { TasksPage } from "./TasksPage";
import { CalculatorPage } from "./CalculatorPage";
import { TranslatorPage } from "./TranslatorPage";
import { ConverterPage } from "./ConverterPage";
import { ChessPage } from "./ChessPage";

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState("notes");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
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
      </div>
    </div>
  );
}