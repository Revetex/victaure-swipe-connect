import { Calendar } from "@/components/ui/calendar";
import { fr } from "date-fns/locale";
import { Todo } from "@/types/todo";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Clock } from "lucide-react";

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
        className="rounded-md border shadow-sm"
        components={{
          DayContent: ({ date }) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const todosForDate = todoDates[dateStr] || [];
            const hasCompletedTodos = todosForDate.some(todo => todo.completed);
            const hasIncompleteTodos = todosForDate.some(todo => !todo.completed);
            
            return (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                      hasIncompleteTodos && "font-medium",
                      isSameDay(date, new Date()) && "bg-primary text-primary-foreground"
                    )}>
                      {date.getDate()}
                    </span>
                    {todosForDate.length > 0 && (
                      <div className="absolute -bottom-1 flex gap-0.5">
                        {hasIncompleteTodos && (
                          <Badge 
                            variant="secondary" 
                            className="h-1.5 w-1.5 rounded-full p-0 bg-yellow-500"
                          />
                        )}
                        {hasCompletedTodos && (
                          <Badge 
                            variant="secondary" 
                            className="h-1.5 w-1.5 rounded-full p-0 bg-green-500"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </HoverCardTrigger>
                {todosForDate.length > 0 && (
                  <HoverCardContent 
                    className="w-80" 
                    align="start"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                      </p>
                      <ScrollArea className="h-[200px] pr-4">
                        <div className="space-y-2">
                          {todosForDate.map((todo) => (
                            <div
                              key={todo.id}
                              className={cn(
                                "flex items-start gap-2 p-2 rounded-lg transition-colors",
                                todo.completed ? "bg-green-50 dark:bg-green-950/20" : "bg-yellow-50 dark:bg-yellow-950/20"
                              )}
                            >
                              <div className="mt-0.5">
                                {todo.completed ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className={cn(
                                  "text-sm font-medium",
                                  todo.completed && "line-through opacity-70"
                                )}>
                                  {todo.text}
                                </p>
                                {todo.dueTime && !todo.allDay && (
                                  <p className="text-xs text-muted-foreground">
                                    {todo.dueTime}
                                  </p>
                                )}
                                {todo.allDay && (
                                  <p className="text-xs text-muted-foreground">
                                    Toute la journée
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
            );
          },
        }}
      />
    </div>
  );
}