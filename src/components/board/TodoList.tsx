
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Task } from '@/types/todo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

interface TodoListProps {
  tasks: Task[];
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TodoList({ tasks, onToggleTask, onDeleteTask }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleToggle = async (taskId: string, currentCompleted: boolean) => {
    await onToggleTask(taskId, !currentCompleted);
  };

  const handleDelete = async (taskId: string) => {
    await onDeleteTask(taskId);
  };

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4 flex items-center gap-3">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => handleToggle(task.id, task.completed)}
                className="data-[state=checked]:bg-primary"
              />
              
              {editingId === task.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                  className="flex-1"
                />
              ) : (
                <span 
                  className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  onDoubleClick={() => {
                    setEditingId(task.id);
                    setEditValue(task.text);
                  }}
                >
                  {task.text}
                </span>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(task.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
