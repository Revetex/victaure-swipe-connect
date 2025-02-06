import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Calculator, Languages, ListTodo, Plus, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

const tools = [
  { id: "notes", icon: Plus, label: "Notes" },
  { id: "tasks", icon: ListTodo, label: "Tâches" },
  { id: "calculator", icon: Calculator, label: "Calculatrice" },
  { id: "translator", icon: Languages, label: "Traducteur" },
  { id: "chess", icon: Swords, label: "Échecs" }
];

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
  const navigate = useNavigate();

  const handleToolClick = (toolId: string) => {
    navigate('/dashboard/tools', { state: { selectedTool: toolId } });
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ type: "spring", damping: 20 }}
          className={cn(
            "fixed top-[4rem] right-0 w-80 h-[calc(100vh-4rem)]",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            "border-l border-border/50 shadow-lg z-50"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold">Outils rapides</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-full">
            <div className="p-4 grid grid-cols-2 gap-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="flex flex-col items-center gap-2 p-4 h-auto hover:bg-muted"
                    onClick={() => handleToolClick(tool.id)}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{tool.label}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}