
import { ListTodo } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskInput } from "@/components/tasks/TaskInput";
import { useTasks } from "@/hooks/useTasks";
import { motion } from "framer-motion";

export function TasksPage() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask
  } = useTasks();

  return (
    <div className="min-h-screen bg-[#1B2A4A] text-[#F2EBE4]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4 max-w-4xl pt-20 relative"
      >
        {/* Background gradient décoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/5 pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <ListTodo className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#F2EBE4]">Tâches</h1>
          </div>

          <div className="space-y-6">
            <TaskInput onAddTask={addTask} />
            <TaskList 
              tasks={tasks} 
              onToggleTask={toggleTask} 
              onDeleteTask={deleteTask} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
