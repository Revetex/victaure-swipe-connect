import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, StickyNote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TodoItem } from "../todo/TodoItem";
import { StickyNote as StickyNoteComponent } from "../todo/StickyNote";
import { Todo, StickyNote as StickyNoteType, ColorOption } from "@/types/todo";

interface UnifiedBoardProps {
  todos: Todo[];
  notes: StickyNoteType[];
  newTodo: string;
  newNote: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  selectedColor?: string;
  colors?: ColorOption[];
  onTodoChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onColorChange: (color: string) => void;
  onAddTodo: () => void;
  onAddNote: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function UnifiedBoard({
  todos = [],
  notes = [],
  newTodo = "",
  newNote = "",
  selectedDate,
  selectedTime,
  allDay,
  selectedColor = "yellow",
  colors = [],
  onTodoChange,
  onNoteChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onColorChange,
  onAddTodo,
  onAddNote,
  onToggleTodo,
  onDeleteTodo,
  onDeleteNote,
}: UnifiedBoardProps) {
  const [activeTab, setActiveTab] = useState<"todos" | "notes">("todos");

  return (
    <div className="h-full bg-background/95 backdrop-blur-sm rounded-lg border border-border/50">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "todos" | "notes")}
        className="h-full flex flex-col"
      >
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="todos" className="flex items-center gap-2 text-base">
              <ListTodo className="h-4 w-4" />
              <span>Tâches</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2 text-base">
              <StickyNote className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="p-3">
            {activeTab === "todos" ? (
              <div className="flex gap-2">
                <Input
                  value={newTodo}
                  onChange={(e) => onTodoChange(e.target.value)}
                  placeholder="Nouvelle tâche..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && onAddTodo()}
                />
                <Button onClick={onAddTodo} size="icon" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder="Nouvelle note..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && onAddNote()}
                />
                <Select onValueChange={onColorChange} defaultValue={selectedColor}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem 
                        key={color.value} 
                        value={color.value}
                        className={`sticky-note-${color.value}`}
                      >
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={onAddNote} size="icon" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="todos" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <motion.div layout className="space-y-3 max-w-3xl mx-auto">
                  <AnimatePresence mode="popLayout">
                    {todos?.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggleTodo}
                        onDelete={onDeleteTodo}
                      />
                    ))}
                    {(!todos || todos.length === 0) && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-muted-foreground py-12"
                      >
                        <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Aucune tâche</p>
                        <p className="text-sm mt-2">
                          Ajoutez votre première tâche
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <motion.div 
                  layout 
                  className={cn(
                    "grid gap-4 max-w-5xl mx-auto",
                    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                    "auto-rows-max"
                  )}
                >
                  <AnimatePresence mode="popLayout">
                    {notes?.map((note) => (
                      <StickyNoteComponent
                        key={note.id}
                        note={note}
                        colorClass={`sticky-note-${note.color}`}
                        onDelete={onDeleteNote}
                      />
                    ))}
                    {(!notes || notes.length === 0) && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-muted-foreground py-12 col-span-full"
                      >
                        <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Aucune note</p>
                        <p className="text-sm mt-2">
                          Créez votre première note en utilisant le formulaire ci-dessus
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}