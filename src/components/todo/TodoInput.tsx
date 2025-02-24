import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelector } from "./TimeSelector";
import { fr } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TodoInputProps {
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAdd: () => void;
}

export function TodoInput({
  newTodo,
  selectedDate,
  selectedTime,
  allDay,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAdd,
}: TodoInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => onTodoChange(e.target.value)}
          placeholder="Nouvelle tâche..."
          className={cn(
            "flex-1 min-w-0",
            "bg-background/50 dark:bg-gray-800/50",
            "border border-border/50 hover:border-border"
          )}
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
      <div className="flex items-center justify-end gap-2">
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
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
        {!allDay && (
          <TimeSelector
            selectedTime={selectedTime}
            onTimeChange={onTimeChange}
          />
        )}
        <div className="flex items-center gap-2">
          <Checkbox
            id="allDay"
            checked={allDay}
            onCheckedChange={(checked) => onAllDayChange(checked as boolean)}
          />
          <Label htmlFor="allDay" className="text-sm">Toute la journée</Label>
        </div>
      </div>
    </div>
  );
}