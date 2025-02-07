
import { motion } from "framer-motion";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { NotesPage } from "../NotesPage";
import { TasksPage } from "../TasksPage";
import { CalculatorPage } from "../CalculatorPage";
import { TranslatorPage } from "../TranslatorPage";
import { ChessPage } from "../ChessPage";

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
    description: "Créer et gérer vos notes",
    component: NotesPage
  },
  { 
    id: "tasks", 
    icon: ListTodo, 
    label: "Tâches",
    description: "Gérer votre liste de tâches",
    component: TasksPage
  },
  { 
    id: "calculator", 
    icon: Calculator, 
    label: "Calculatrice",
    description: "Effectuer des calculs",
    component: CalculatorPage
  },
  { 
    id: "translator", 
    icon: Languages, 
    label: "Traducteur",
    description: "Traduire du texte",
    component: TranslatorPage
  },
  { 
    id: "converter", 
    icon: Ruler, 
    label: "Convertisseur",
    description: "Convertir des unités",
    component: () => (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Convertisseur (Bientôt disponible)</p>
      </div>
    )
  },
  { 
    id: "chess", 
    icon: Sword, 
    label: "Échecs",
    description: "Jouer aux échecs",
    component: ChessPage
  }
];

export function ToolsNavigation({ activeTool, onToolChange, toolsOrder }: ToolsNavigationProps) {
  const [openTool, setOpenTool] = useState<Tool | null>(null);
  
  const orderedTools = toolsOrder.map(toolId => 
    tools.find(t => t.id === toolId)
  ).filter(Boolean);

  const handleToolClick = (toolId: Tool) => {
    setOpenTool(toolId);
    onToolChange(toolId);
  };

  const handleClose = () => {
    setOpenTool(null);
  };

  const activeTool_ = tools.find(tool => tool.id === openTool);
  const ActiveComponent = activeTool_?.component;

  return (
    <>
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
                onClick={() => handleToolClick(tool.id as Tool)}
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

      <Dialog open={!!openTool} onOpenChange={() => setOpenTool(null)}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {activeTool_?.label}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
