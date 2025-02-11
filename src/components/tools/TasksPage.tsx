
import { ListTodo } from "lucide-react";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskInput } from "@/components/tasks/TaskInput";
import { useTasks } from "@/hooks/useTasks";

export function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <div className="container mx-auto p-4 max-w-4xl pt-16 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ListTodo className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Gestionnaire de tâches</h1>
      </div>

      <TaskInput onAddTask={addTask} />
      <TaskList 
        tasks={tasks} 
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}
