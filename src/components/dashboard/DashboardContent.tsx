import { motion, AnimatePresence } from "framer-motion";
import { VCard } from "@/components/VCard";
import { useProfile } from "@/hooks/useProfile";
import { useVCardStyle } from "@/components/vcard/VCardStyleContext";
import { Messages } from "@/components/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { UnifiedBoard } from "@/components/board/UnifiedBoard";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { Feed } from "@/components/Feed";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListTodo, StickyNote, Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  viewportHeight,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const { profile, setProfile } = useProfile();
  const { selectedStyle } = useVCardStyle();
  
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

  const colors = [
    { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
    { value: "blue", label: "Bleu", class: "bg-blue-200" },
    { value: "green", label: "Vert", class: "bg-green-200" },
    { value: "red", label: "Rouge", class: "bg-red-200" },
    { value: "purple", label: "Violet", class: "bg-purple-200" }
  ];

  const InfoBadge = ({ content }: { content: string }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
          <Info className="h-4 w-4 text-primary" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <p className="text-sm text-muted-foreground">{content}</p>
      </HoverCardContent>
    </HoverCard>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 1: // Profile
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Votre Profil Professionnel</h2>
              <InfoBadge content="Créez votre carte de visite professionnelle personnalisée et partagez-la facilement." />
            </div>
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />
          </motion.div>
        );
      case 2: // Messages
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Messages</h2>
              <InfoBadge content="Communiquez efficacement avec vos contacts professionnels et restez connecté." />
            </div>
            <Messages />
          </motion.div>
        );
      case 3: // Jobs
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Opportunités Professionnelles</h2>
              <InfoBadge content="Découvrez des opportunités adaptées à votre profil et développez votre carrière." />
            </div>
            <Marketplace />
          </motion.div>
        );
      case 4: // Feed
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Actualités</h2>
              <InfoBadge content="Restez informé des dernières actualités de votre réseau professionnel." />
            </div>
            <Feed />
          </motion.div>
        );
      case 5: // Tools
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            className="w-full px-4"
          >
            <div className="w-full sm:max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold">Outils de Productivité</h2>
                <InfoBadge content="Gérez efficacement vos tâches et prenez des notes pour rester organisé." />
              </div>
              
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="tasks" className="border rounded-lg bg-card shadow-sm">
                  <AccordionTrigger className="px-4 hover:no-underline group">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
                      <span className="font-semibold group-hover:text-primary/80 transition-colors">Tâches</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="h-[calc(100vh-16rem)] overflow-auto">
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notes" className="border rounded-lg bg-card shadow-sm">
                  <AccordionTrigger className="px-4 hover:no-underline group">
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
                      <span className="font-semibold group-hover:text-primary/80 transition-colors">Notes</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="h-[calc(100vh-16rem)] overflow-auto">
                      <NotesSection
                        notes={notes}
                        newNote={newNote}
                        selectedColor={selectedColor}
                        colors={colors}
                        onNoteChange={setNewNote}
                        onColorChange={setSelectedColor}
                        onAdd={addNote}
                        onDelete={deleteNote}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        );
      case 6: // Settings
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Paramètres</h2>
              <InfoBadge content="Personnalisez votre expérience et gérez vos préférences." />
            </div>
            <Settings />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full min-h-screen pb-20",
        "bg-gradient-to-br from-background via-background/95 to-background/90"
      )}
    >
      <div className="container mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </motion.div>
  );
}