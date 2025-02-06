import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, NotebookPen, Calculator, Languages, Settings, ListTodo } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

const tools = [
  {
    id: "notes",
    name: "Notes",
    icon: NotebookPen,
    description: "Gérer vos notes"
  },
  {
    id: "tasks",
    name: "Tâches",
    icon: ListTodo,
    description: "Gérer vos tâches"
  },
  {
    id: "calculator",
    name: "Calculatrice",
    icon: Calculator,
    description: "Calculatrice et convertisseur"
  },
  {
    id: "translator",
    name: "Traducteur",
    icon: Languages,
    description: "Traduire du texte"
  },
  {
    id: "chess",
    name: "Échecs",
    icon: Settings,
    description: "Jouer aux échecs"
  }
];

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  if (!show) return null;

  const handleToolClick = (toolId: string) => {
    navigate(`/dashboard/tools/${toolId}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-[4rem] z-[100] bg-background/95 backdrop-blur-sm border-b",
        "overflow-hidden shadow-lg",
        isMobile ? "h-[calc(100vh-4rem)]" : "h-[70vh]"
      )}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="max-w-3xl mx-auto relative h-full py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="h-full overflow-y-auto space-y-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Outils</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="flex items-center gap-3 p-4 h-auto"
                    onClick={() => handleToolClick(tool.id)}
                  >
                    <tool.icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tool.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Connexions</h3>
              <FriendsContent />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}