import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelector } from "./TimeSelector";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => onTodoChange(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="glass-card flex-1"
            onKeyPress={(e) => e.key === 'Enter' && newTodo.trim() && onAdd()}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(
                  "glass-card hover:bg-primary/5",
                  selectedDate && "text-primary border-primary"
                )}
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
                className="rounded-md border"
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
          disabled={!newTodo.trim()} 
          size="icon"
          variant="outline"
          className="glass-card hover:bg-primary hover:text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {(selectedDate || selectedTime) && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-xs text-muted-foreground flex items-center gap-2"
        >
          {selectedDate && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {selectedDate.toLocaleDateString('fr-FR')}
            </span>
          )}
          {selectedTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {selectedTime}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}