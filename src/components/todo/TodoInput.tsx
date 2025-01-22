import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TimeSelector } from "./TimeSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TodoInputProps {
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
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
  onAdd
}: TodoInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Ajouter une tâche..."
          value={newTodo}
          onChange={(e) => onTodoChange(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newTodo.trim()) {
              onAdd();
            }
          }}
        />
        <Button 
          onClick={onAdd}
          disabled={!newTodo.trim()}
          size="icon"
        >
          +
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-[140px]",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : <span>Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {!allDay && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[120px]",
                  !selectedTime && "text-muted-foreground"
                )}
              >
                <Clock className="mr-2 h-4 w-4" />
                {selectedTime || <span>Heure</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <TimeSelector
                selectedTime={selectedTime}
                onChange={onTimeChange}
              />
            </PopoverContent>
          </Popover>
        )}

        <div className="flex items-center space-x-2 ml-auto">
          <Switch
            id="all-day"
            checked={allDay}
            onCheckedChange={onAllDayChange}
          />
          <Label htmlFor="all-day">Toute la journée</Label>
        </div>
      </div>
    </div>
  );
}