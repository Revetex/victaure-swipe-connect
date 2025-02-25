
import { useState } from "react";
import { TaskInput } from "./TaskInput";
import { TaskList } from "./TaskList";
import { Task } from "@/types/tasks";
import { motion } from "framer-motion";

export function TaskContainer() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (text: string, dueDate?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Mes Tâches
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organisez votre journée efficacement
          </p>
        </header>

        <TaskInput onAddTask={addTask} />
        <TaskList 
          tasks={tasks} 
          onToggleTask={toggleTask} 
          onDeleteTask={deleteTask}
        />
      </div>
    </motion.div>
  );
}
