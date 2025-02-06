import { Calculator, Languages, ListTodo, Plus, Ruler, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tool = "notes" | "tasks" | "calculator" | "translator" | "chess";

interface ToolsNavigationProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  toolsOrder: Tool[];
}

export function ToolsNavigation({ activeTool, onToolChange, toolsOrder }: ToolsNavigationProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Button 
        variant={activeTool === "notes" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange("notes")}
        className="whitespace-nowrap"
      >
        <Plus className="h-4 w-4 mr-2" />
        Notes
      </Button>
      <Button 
        variant={activeTool === "tasks" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange("tasks")}
        className="whitespace-nowrap"
      >
        <ListTodo className="h-4 w-4 mr-2" />
        Tâches
      </Button>
      <Button 
        variant={activeTool === "calculator" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange("calculator")}
        className="whitespace-nowrap"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Calculatrice
      </Button>
      <Button 
        variant={activeTool === "translator" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange("translator")}
        className="whitespace-nowrap"
      >
        <Languages className="h-4 w-4 mr-2" />
        Traducteur
      </Button>
      <Button 
        variant={activeTool === "converter" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange("converter")}
        className="whitespace-nowrap"
      >
        <Ruler className="h-4 w-4 mr-2" />
        Convertisseur
      </Button>
      <Button 
        variant={activeTool === "chess" ? "default" : "outline"}
        size="sm"
        onClick={() => onToolChange("chess")}
        className="whitespace-nowrap"
      >
        <Sword className="h-4 w-4 mr-2" />
        Échecs
      </Button>
    </div>
  );
}