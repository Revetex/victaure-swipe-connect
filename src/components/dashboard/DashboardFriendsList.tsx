import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calculator, ListTodo, Settings, Sword, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NotesPage } from "@/components/tools/NotesPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";
import { useState } from "react";

const menuItems = [
  {
    id: "tasks",
    name: "Tâches",
    icon: ListTodo,
    description: "Gérer vos tâches",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    id: "calculator",
    name: "Calculatrice",
    icon: Calculator,
    description: "Calculer et convertir",
    color: "bg-green-500/10 text-green-500"
  },
  {
    id: "chess",
    name: "Échecs",
    icon: Sword,
    description: "Jouer aux échecs",
    color: "bg-red-500/10 text-red-500"
  },
  {
    id: "settings",
    name: "Paramètres",
    icon: Settings,
    description: "Configurer votre compte",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    id: "profile",
    name: "Profil",
    icon: User,
    description: "Gérer votre profil",
    color: "bg-orange-500/10 text-orange-500"
  }
];

interface DashboardMenuProps {
  show: boolean;
  onClose: () => void;
}

export function DashboardFriendsList({ show, onClose }: DashboardMenuProps) {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    setSelectedTool(itemId);
    switch (itemId) {
      case 'chess':
        navigate('/dashboard/tools/chess');
        onClose();
        break;
      case 'settings':
        navigate('/settings');
        onClose();
        break;
      case 'profile':
        navigate('/dashboard/profile');
        onClose();
        break;
      default:
        // For tools that open in dialog
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50"
    >
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-3 p-6 h-auto",
                  "hover:bg-accent/5 transition-all duration-200",
                  "group relative"
                )}
                onClick={() => handleItemClick(item.id)}
              >
                <div className={cn(
                  "p-4 rounded-lg transition-all duration-200",
                  "group-hover:scale-110",
                  item.color
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <Dialog open={selectedTool === 'tasks'} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <TasksPage />
        </DialogContent>
      </Dialog>

      <Dialog open={selectedTool === 'calculator'} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <CalculatorPage />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}