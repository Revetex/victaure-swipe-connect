
import { useState } from "react";
import { TaskList } from "@/components/todo/TaskList";
import { TaskInput } from "@/components/todo/TaskInput";
import { useTodoList } from "@/hooks/useTodoList";
import { Card } from "@/components/ui/card";

export function TasksSection() {
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
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-4 mb-6">
        <TaskInput
          newTodo={newTodo}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          allDay={allDay}
          onTodoChange={setNewTodo}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          onAllDayChange={setAllDay}
          onAdd={addTodo}
        />
      </Card>

      <TaskList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}
