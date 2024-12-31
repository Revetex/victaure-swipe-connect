import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { useTodoList } from "@/hooks/useTodoList";
import { motion } from "framer-motion";

export function TodoSection() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoList();

  return (
    <motion.div 
      className="h-full flex flex-col gap-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TodoInput onAdd={addTodo} />
      <div className="flex-1 overflow-y-auto space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}