
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TabsContent } from "./tabs/TabsContent";
import { TabsList } from "./tabs/TabsList";
import { Task } from "@/types/tasks";

export function UnifiedBoard() {
  const [activeTab, setActiveTab] = useState("todos");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="p-4 space-y-4">
      <TabsList activeTab={activeTab} onTabChange={setActiveTab} />
      <AnimatePresence mode="wait">
        <TabsContent 
          activeTab={activeTab}
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </AnimatePresence>
    </div>
  );
}
