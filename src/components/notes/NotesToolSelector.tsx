import { Calculator, Languages, ListTodo, Plus, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesToolSelectorProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export function NotesToolSelector({ selectedTool, onToolSelect }: NotesToolSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Button 
        variant={selectedTool === "notes" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("notes")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Notes
      </Button>
      <Button 
        variant={selectedTool === "tasks" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("tasks")}
      >
        <ListTodo className="h-4 w-4 mr-2" />
        Tâches
      </Button>
      <Button 
        variant={selectedTool === "calculator" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("calculator")}
      >
        <Calculator className="h-4 w-4 mr-2" />
        Calculatrice
      </Button>
      <Button 
        variant={selectedTool === "translator" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("translator")}
      >
        <Languages className="h-4 w-4 mr-2" />
        Traducteur
      </Button>
      <Button 
        variant={selectedTool === "converter" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("converter")}
      >
        <Ruler className="h-4 w-4 mr-2" />
        Convertisseur
      </Button>
    </div>
  );
}