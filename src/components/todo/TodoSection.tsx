
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";
import { NotesSection } from "./NotesSection";
import { Calendar, ListTodo, StickyNote } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

export function TodoSection() {
  const [activeTab, setActiveTab] = useState("todos");
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  return (
    <Card className={cn(
      "bg-gradient-to-br from-[#F2FCE2]/50 via-[#D3E4FD]/30 to-[#FFDEE2]/20",
      "backdrop-blur-sm border rounded-xl shadow-lg"
    )}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
          Gestionnaire de tâches
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              Tâches
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-4">
            <TodoInput onAddTask={addTask} />
            <TodoList 
              tasks={tasks || []}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-center text-muted-foreground"
            >
              Fonctionnalité de calendrier à venir...
            </motion.div>
          </TabsContent>

          <TabsContent value="notes">
            <NotesSection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
