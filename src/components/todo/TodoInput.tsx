import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TodoInputProps {
  newTodo: string;
  onTodoChange: (value: string) => void;
  onAdd: () => void;
}

export function TodoInput({
  newTodo,
  onTodoChange,
  onAdd,
}: TodoInputProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={newTodo}
        onChange={(e) => onTodoChange(e.target.value)}
        placeholder="Nouvelle note..."
        className="flex-1 min-h-[44px] glass-card"
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
      />
      <Button 
        onClick={onAdd} 
        size="icon"
        variant="ghost"
        className="hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}