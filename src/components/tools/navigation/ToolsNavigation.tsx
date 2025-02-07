
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Languages, ListTodo, Plus, Ruler, Sword, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { NotesPage } from "../NotesPage";
import { TasksPage } from "../TasksPage";
import { CalculatorPage } from "../CalculatorPage";
import { TranslatorPage } from "../TranslatorPage";
import { ChessPage } from "../ChessPage";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Tool = "notes" | "tasks" | "calculator" | "translator" | "chess" | "converter";

interface ToolsNavigationProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  toolsOrder: Tool[];
  onReorderTools?: (newOrder: Tool[]) => void;
  isLoading?: boolean;
}

interface ToolInfo {
  id: Tool;
  icon: any;
  label: string;
  description: string;
  component: React.ComponentType<any>;
  gradient: string;
  comingSoon?: boolean;
}

const tools: ToolInfo[] = [
  { 
    id: "notes", 
    icon: Plus, 
    label: "Notes",
    description: "Créer et gérer vos notes",
    component: NotesPage,
    gradient: "from-amber-500/20 via-orange-500/20 to-rose-500/20"
  },
  { 
    id: "tasks", 
    icon: ListTodo, 
    label: "Tâches",
    description: "Gérer votre liste de tâches",
    component: TasksPage,
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20"
  },
  { 
    id: "calculator", 
    icon: Calculator, 
    label: "Calculatrice",
    description: "Effectuer des calculs",
    component: CalculatorPage,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20"
  },
  { 
    id: "translator", 
    icon: Languages, 
    label: "Traducteur",
    description: "Traduire du texte",
    component: TranslatorPage,
    gradient: "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20"
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
    ),
    gradient: "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
    comingSoon: true
  },
  { 
    id: "chess", 
    icon: Sword, 
    label: "Échecs",
    description: "Jouer aux échecs",
    component: ChessPage,
    gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20"
  }
];

export function ToolsNavigation({ 
  activeTool, 
  onToolChange, 
  toolsOrder,
  onReorderTools,
  isLoading 
}: ToolsNavigationProps) {
  const [openTool, setOpenTool] = useState<Tool | null>(null);
  const isMobile = useIsMobile();

  const orderedTools = toolsOrder
    .map(toolId => tools.find(t => t.id === toolId))
    .filter(Boolean) as ToolInfo[];

  const handleToolClick = (toolId: Tool) => {
    if (isLoading) return;
    setOpenTool(toolId);
    onToolChange(toolId);
  };

  const handleClose = () => {
    setOpenTool(null);
  };

  const activeTool_ = tools.find(tool => tool.id === openTool);
  const ActiveComponent = activeTool_?.component;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      )}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full h-28" />
        ))}
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        )}
      >
        {orderedTools.map((tool, index) => {
          if (!tool) return null;
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button 
                variant={isActive ? "default" : "outline"}
                onClick={() => handleToolClick(tool.id)}
                className={cn(
                  "w-full h-28 flex flex-col items-center justify-center gap-3 p-4",
                  "transition-all duration-300",
                  "hover:shadow-lg hover:border-primary/20",
                  "bg-gradient-to-br",
                  tool.gradient,
                  isActive && "ring-2 ring-primary/20",
                  tool.comingSoon && "opacity-50 cursor-not-allowed"
                )}
                disabled={tool.comingSoon}
                aria-label={tool.description}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tool.id}-panel`}
              >
                <Icon className={cn(
                  "h-6 w-6 transition-transform duration-300",
                  "group-hover:scale-110",
                  isActive && "text-primary"
                )} />
                <span className="text-sm font-medium text-center line-clamp-2">
                  {tool.label}
                  {tool.comingSoon && (
                    <span className="block text-xs text-muted-foreground">
                      Bientôt disponible
                    </span>
                  )}
                </span>
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      <Dialog open={!!openTool} onOpenChange={() => setOpenTool(null)}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0">
          <div className="flex flex-col h-full">
            <div className="sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <div className="flex-1 overflow-auto">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
