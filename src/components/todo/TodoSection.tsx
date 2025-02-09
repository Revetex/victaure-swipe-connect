
import { Todo } from "@/types/todo";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addDays, addHours, isFuture } from "date-fns";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAddTodo: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoSection({
  todos,
  newTodo,
  selectedDate,
  selectedTime,
  allDay,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: TodoSectionProps) {
  const createNotification = async (todoText: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Nouvelle tâche',
      message: `Vous avez créé une nouvelle tâche : ${todoText}`,
    });
  };

  const createReminderNotifications = async (todoText: string, dueDate: Date, dueTime?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let notificationDate = dueDate;
    
    // If there's a specific time
    if (dueTime) {
      const [hours, minutes] = dueTime.split(':').map(Number);
      notificationDate.setHours(hours, minutes);

      // Create notification 1 hour before if the time hasn't passed yet
      const oneHourBefore = addHours(notificationDate, -1);
      if (isFuture(oneHourBefore)) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          title: 'Rappel de tâche (1 heure)',
          message: `Rappel: "${todoText}" est prévu dans 1 heure`,
          scheduled_for: oneHourBefore.toISOString(),
        });
      }
    }

    // Create notification 1 day before if the date hasn't passed yet
    const oneDayBefore = addDays(notificationDate, -1);
    if (isFuture(oneDayBefore)) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Rappel de tâche (1 jour)',
        message: `Rappel: "${todoText}" est prévu demain${dueTime ? ` à ${dueTime}` : ''}`,
        scheduled_for: oneDayBefore.toISOString(),
      });
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      onAddTodo();
      await createNotification(newTodo);
      
      // Create reminder notifications if there's a due date
      if (selectedDate) {
        await createReminderNotifications(newTodo, selectedDate, !allDay ? selectedTime : undefined);
      }
      
      toast.success("Tâche ajoutée avec succès");
    }
  };

  return (
    <div className="h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)]">
      <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm rounded-lg border border-border/50">
        <div className="p-4">
          <TodoInput
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            allDay={allDay}
            onTodoChange={onTodoChange}
            onDateChange={onDateChange}
            onTimeChange={onTimeChange}
            onAllDayChange={onAllDayChange}
            onAdd={handleAddTodo}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <TodoList
            todos={todos}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        </div>
      </div>
    </div>
  );
}
