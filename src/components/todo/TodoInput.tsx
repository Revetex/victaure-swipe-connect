import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelector } from "./TimeSelector";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <div className="flex-1 flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => onTodoChange(e.target.value)}
          placeholder={t("todo.newTask")}
          className="glass-card flex-1"
          onKeyPress={(e) => e.key === 'Enter' && onAdd()}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={`glass-card ${selectedDate ? 'text-primary' : ''}`}
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
      </div>
      <Button 
        onClick={onAdd} 
        size="icon"
        variant="outline"
        className="glass-card hover:bg-primary hover:text-white transition-colors"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}