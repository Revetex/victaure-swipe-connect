import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelector } from "./TimeSelector";
import { fr } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TaskInputProps {
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

export function TaskInput({
  newTodo,
  selectedDate,
  selectedTime,
  allDay,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAdd,
}: TaskInputProps) {
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
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "flex items-center gap-2",
                  selectedDate && "text-primary"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {selectedDate ? (
                  <span className="hidden sm:inline">
                    {selectedDate.toLocaleDateString('fr-FR')}
                  </span>
                ) : (
                  <span className="hidden sm:inline">Date</span>
                )}
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

          {!allDay && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "flex items-center gap-2",
                    selectedTime && "text-primary"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  {selectedTime || "Heure"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <TimeSelector
                  selectedTime={selectedTime}
                  onTimeChange={onTimeChange}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="allDay"
            checked={allDay}
            onCheckedChange={(checked) => onAllDayChange(checked as boolean)}
          />
          <Label htmlFor="allDay" className="text-sm">
            Toute la journée
          </Label>
        </div>
      </div>

      {(selectedDate || selectedTime) && (
        <div className="flex gap-2 flex-wrap">
          {selectedDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              {selectedDate.toLocaleDateString('fr-FR')}
            </Badge>
          )}
          {selectedTime && !allDay && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {selectedTime}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}