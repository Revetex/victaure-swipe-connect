import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, Briefcase } from "lucide-react";
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
        className="whitespace-nowrap"
      >
        <Plus className="h-4 w-4 mr-2" />
        Notes
      </Button>
      <Button 
        variant={selectedTool === "tasks" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("tasks")}
        className="whitespace-nowrap"
      >
        <ListTodo className="h-4 w-4 mr-2" />
        Tâches
      </Button>
      <Button 
        variant={selectedTool === "calculator" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("calculator")}
        className="whitespace-nowrap"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Calculatrice
      </Button>
      <Button 
        variant={selectedTool === "translator" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("translator")}
        className="whitespace-nowrap"
      >
        <Languages className="h-4 w-4 mr-2" />
        Traducteur
      </Button>
      <Button 
        variant={selectedTool === "converter" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("converter")}
        className="whitespace-nowrap"
      >
        <Ruler className="h-4 w-4 mr-2" />
        Convertisseur
      </Button>
      <Button 
        variant={selectedTool === "chess" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("chess")}
        className="whitespace-nowrap"
      >
        <Sword className="h-4 w-4 mr-2" />
        Échecs
      </Button>
      <Button 
        variant={selectedTool === "jobs" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolSelect("jobs")}
        className="whitespace-nowrap"
      >
        <Briefcase className="h-4 w-4 mr-2" />
        Emplois
      </Button>
    </div>
  );
}