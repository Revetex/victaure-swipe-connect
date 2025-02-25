
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskInputProps {
  onAddTask: (task: string, dueDate?: string) => void;
  className?: string;
}

export function TaskInput({ onAddTask, className }: TaskInputProps) {
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskText.trim()) {
      toast.error("La tâche ne peut pas être vide");
      return;
    }

    onAddTask(taskText, dueDate || undefined);
    setTaskText("");
    setDueDate("");
    toast.success("Tâche ajoutée avec succès");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-white/50 dark:bg-gray-900/50",
        "backdrop-blur-lg",
        "rounded-xl",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-lg",
        "p-4",
        "space-y-4",
        className
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="flex-1 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowDateInput(!showDateInput)}
            className="bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        <AnimatePresence>
          {showDateInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
