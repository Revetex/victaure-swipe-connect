import { TodoSection } from "@/components/todo/TodoSection";
import { useTodoList } from "@/hooks/useTodoList";

export function TasksPage() {
  const {
    todos,
    newTodo,
    selectedDate,
    selectedTime,
    allDay,
    setNewTodo,
    setSelectedDate,
    setSelectedTime,
    setAllDay,
    addTodo,
    toggleTodo,
    deleteTodo
  } = useTodoList();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tâches</h1>
      <TodoSection
        todos={todos}
        newTodo={newTodo}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        allDay={allDay}
        onTodoChange={setNewTodo}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onAllDayChange={setAllDay}
        onAddTodo={addTodo}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
    </div>
  );
}