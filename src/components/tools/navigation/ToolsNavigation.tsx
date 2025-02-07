
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
  { 
    id: "notes", 
    icon: Plus, 
    label: "Notes",
    description: "Créer et gérer vos notes" 
  },
  { 
    id: "tasks", 
    icon: ListTodo, 
    label: "Tâches",
    description: "Gérer votre liste de tâches" 
  },
  { 
    id: "calculator", 
    icon: Calculator, 
    label: "Calculatrice",
    description: "Effectuer des calculs" 
  },
  { 
    id: "translator", 
    icon: Languages, 
    label: "Traducteur",
    description: "Traduire du texte" 
  },
  { 
    id: "converter", 
    icon: Ruler, 
    label: "Convertisseur",
    description: "Convertir des unités" 
  },
  { 
    id: "chess", 
    icon: Sword, 
    label: "Échecs",
    description: "Jouer aux échecs" 
  }
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
        const isActive = activeTool === tool.id;
        
        return (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button 
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onToolChange(tool.id as Tool)}
              className="whitespace-nowrap min-w-[120px] transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary/20"
              aria-label={tool.description}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tool.id}-panel`}
              title={tool.description}
            >
              <Icon className="h-4 w-4 mr-2 shrink-0" 
                aria-hidden="true"
                role="presentation"
              />
              <span className="truncate">{tool.label}</span>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

