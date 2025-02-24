
import { Task } from "@/types/tasks";
import { TodoList } from "../TodoList";
import { motion } from "framer-motion";

interface TabsContentProps {
  activeTab: string;
  tasks: Task[];
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TabsContent({ activeTab, tasks, onToggleTask, onDeleteTask }: TabsContentProps) {
  return (
    <div className="mt-4">
      {activeTab === "todos" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TodoList 
            tasks={tasks}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        </motion.div>
      )}
      
      {activeTab === "calendar" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-center text-muted-foreground"
        >
          Fonctionnalité de calendrier à venir...
        </motion.div>
      )}
    </div>
  );
}
