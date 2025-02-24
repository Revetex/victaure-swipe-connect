
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Languages, Ruler, Sword } from "lucide-react";
import { motion } from "framer-motion";
import { Todo, StickyNote as StickyNoteType } from "@/types/todo";
import { TodoList } from "../TodoList";
import { NoteGrid } from "../NoteGrid";

interface TabsContentProps {
  todos: Todo[];
  notes: StickyNoteType[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

export function BoardTabsContent({ 
  todos, 
  notes, 
  onToggleTodo, 
  onDeleteTodo, 
  onDeleteNote 
}: TabsContentProps) {
  const ComingSoonTab = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center justify-center h-full p-4"
    >
      <div className="text-center space-y-4">
        <Icon className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="text-muted-foreground">{text} (Bientôt disponible)</p>
      </div>
    </motion.div>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <TabsContent value="todos" className="h-full m-0">
        <ScrollArea className="h-full px-4">
          <TodoList
            todos={todos}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="notes" className="h-full m-0">
        <ScrollArea className="h-full">
          <NoteGrid
            notes={notes}
            onDeleteNote={onDeleteNote}
          />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="calculator" className="h-full m-0">
        <ComingSoonTab icon={Calculator} text="Calculatrice" />
      </TabsContent>

      <TabsContent value="translator" className="h-full m-0">
        <ComingSoonTab icon={Languages} text="Traducteur" />
      </TabsContent>

      <TabsContent value="converter" className="h-full m-0">
        <ComingSoonTab icon={Ruler} text="Convertisseur" />
      </TabsContent>

      <TabsContent value="chess" className="h-full m-0">
        <ComingSoonTab icon={Sword} text="Échecs" />
      </TabsContent>
    </div>
  );
}

