import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calculator, ListTodo, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NotesPage } from "@/components/tools/NotesPage";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";

const tools = [
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
    description: "Calculer et convertir"
  },
  {
    id: "chess",
    name: "Échecs",
    icon: Sword,
    description: "Jouer aux échecs"
  }
];

interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    if (toolId === 'chess') {
      navigate('/dashboard/tools/chess');
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-3 p-6 h-auto",
                  "hover:bg-accent/5 transition-all duration-200",
                  "group relative"
                )}
                onClick={() => handleToolClick(tool.id)}
              >
                <div className={cn(
                  "p-4 rounded-lg transition-all duration-200",
                  "group-hover:scale-110",
                  tool.id === 'chess' ? 'bg-red-500/10 text-red-500' :
                  tool.id === 'calculator' ? 'bg-green-500/10 text-green-500' :
                  'bg-blue-500/10 text-blue-500'
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.description}
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