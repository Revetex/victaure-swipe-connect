import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelector } from "./TimeSelector";
import { fr } from "date-fns/locale";

interface TodoInputProps {
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAdd: () => void;
}

export function TodoInput({
  newTodo,
  selectedDate,
  selectedTime,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAdd,
}: TodoInputProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex-grow relative">
        <Input
          value={newTodo}
          onChange={(e) => onTodoChange(e.target.value)}
          placeholder="Nouvelle tâche..."
          className="w-full min-h-[44px] pr-32 glass-card"
          onKeyPress={(e) => e.key === 'Enter' && onAdd()}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={selectedDate ? 'text-primary' : 'text-muted-foreground'}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          <TimeSelector
            selectedTime={selectedTime}
            onTimeChange={onTimeChange}
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
      </div>
    </div>
  );
}