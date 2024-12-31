import { TodoSection } from "./todo/TodoSection";
import { useTodoList } from "@/hooks/useTodoList";

export function TodoList() {
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
    <div className="space-y-4">
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
        onAdd={addTodo}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}