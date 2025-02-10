import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";

interface TodoToolbarProps {
  newTodo: string;
  onTodoChange: (value: string) => void;
  onAddTodo: () => void;
}

export function TodoToolbar({ newTodo, onTodoChange, onAddTodo }: TodoToolbarProps) {
  return (
    <div className="flex gap-2">
      <Input
        value={newTodo}
        onChange={(e) => onTodoChange(e.target.value)}
        placeholder="Nouvelle tâche..."
        className="flex-1"
        onKeyPress={(e) => e.key === 'Enter' && onAddTodo()}
      />
      <Button onClick={onAddTodo} size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}