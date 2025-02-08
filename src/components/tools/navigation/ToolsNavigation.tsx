
import { motion } from "framer-motion";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tool = "notes" | "tasks" | "calculator" | "translator" | "chess" | "converter";

interface ToolsNavigationProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  toolsOrder: Tool[];
}

const tools = [
  { id: "notes", icon: Plus, label: "Notes" },
  { id: "tasks", icon: ListTodo, label: "Tâches" },
  { id: "calculator", icon: Calculator, label: "Calculatrice" },
  { id: "translator", icon: Languages, label: "Traducteur" },
  { id: "converter", icon: Ruler, label: "Convertisseur" },
  { id: "chess", icon: Sword, label: "Échecs" }
];

export function ToolsNavigation({ activeTool, onToolChange, toolsOrder }: ToolsNavigationProps) {
  const orderedTools = toolsOrder.map(toolId => 
    tools.find(t => t.id === toolId)
  ).filter(Boolean);

  return (
    <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {orderedTools.map((tool, index) => {
        if (!tool) return null;
        const Icon = tool.icon;
        
        return (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button 
              variant={activeTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => onToolChange(tool.id as Tool)}
              className="whitespace-nowrap min-w-[120px] transition-all duration-300 hover:scale-105"
            >
              <Icon className="h-4 w-4 mr-2" />
              {tool.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
