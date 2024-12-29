import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { Todo } from "@/types/todo";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CalendarViewProps {
  todos: Todo[];
  onDateSelect: (date?: Date) => void;
}

export function CalendarView({ todos, onDateSelect }: CalendarViewProps) {
  const todoDates = todos
    .filter(todo => todo.dueDate)
    .reduce((acc, todo) => {
      const dateStr = format(todo.dueDate!, 'yyyy-MM-dd');
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(todo);
      return acc;
    }, {} as Record<string, Todo[]>);

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        onSelect={onDateSelect}
        locale={fr}
        components={{
          DayContent: ({ date }) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const todosForDate = todoDates[dateStr] || [];
            
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <span>{date.getDate()}</span>
                {todosForDate.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -bottom-1 text-[0.6rem] h-3 min-w-3 flex items-center justify-center"
                  >
                    {todosForDate.length}
                  </Badge>
                )}
              </div>
            );
          },
        }}
      />
    </div>
  );
}