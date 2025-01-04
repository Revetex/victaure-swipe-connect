import { Tabs } from "@/components/ui/tabs";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { MessagesTabs } from "./messages/MessagesTabs";
import { MessagesContent } from "./messages/MessagesContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Messages() {
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

  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  } = useNotes();

  // Fetch scraped jobs
  const { data: scrapedJobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['scraped-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scraped_jobs')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  const colors = [
    { value: 'yellow', label: 'Jaune', class: 'bg-yellow-200' },
    { value: 'blue', label: 'Bleu', class: 'bg-blue-200' },
    { value: 'green', label: 'Vert', class: 'bg-green-200' },
    { value: 'pink', label: 'Rose', class: 'bg-pink-200' },
    { value: 'purple', label: 'Violet', class: 'bg-purple-200' },
    { value: 'peach', label: 'Pêche', class: 'bg-orange-200' },
    { value: 'gray', label: 'Gris', class: 'bg-gray-200' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-300' },
  ];

  return (
    <Tabs defaultValue="messages" className="h-full flex flex-col">
      <MessagesTabs scrapedJobsCount={scrapedJobs?.length || 0} />
      <MessagesContent
        todos={todos}
        notes={notes}
        newTodo={newTodo}
        newNote={newNote}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedColor={selectedColor}
        allDay={allDay}
        onTodoChange={setNewTodo}
        onNoteChange={setNewNote}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onColorChange={setSelectedColor}
        onAllDayChange={setAllDay}
        onAdd={addTodo}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onDeleteNote={deleteNote}
        colors={colors}
        scrapedJobs={scrapedJobs}
        isLoadingJobs={isLoadingJobs}
      />
    </Tabs>
  );
}