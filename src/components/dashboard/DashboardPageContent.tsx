import { VCard } from "@/components/VCard";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { Settings } from "@/components/Settings";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";
import { memo } from "react";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardPageContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (state: boolean) => void;
  onRequestChat: () => void;
  todoProps: any;
  noteProps: any;
}

export const DashboardPageContent = memo(function DashboardPageContent({
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat,
  todoProps,
  noteProps
}: DashboardPageContentProps) {
  const colors = useColorPalette();
  const isMobile = useIsMobile();

  switch (currentPage) {
    case 1:
      return (
        <div 
          key="vcard-container"
          className={`${isEditing ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm pb-32' : 'relative min-h-[calc(100vh-4rem)]'}`}
          style={{ 
            height: isEditing ? viewportHeight : 'auto',
            overflowY: isEditing ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="dashboard-card h-full">
            <div className="p-3 sm:p-4 md:p-6 h-full">
              <VCard 
                onEditStateChange={onEditStateChange}
                onRequestChat={onRequestChat}
              />
            </div>
          </div>
        </div>
      );
    case 2:
      return (
        <div key="messages-container" className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <Messages />
          </div>
        </div>
      );
    case 3:
      return (
        <div key="swipe-container" className="dashboard-card h-full">
          <SwipeJob />
        </div>
      );
    case 4:
      return (
        <div key="todo-notes-container" className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <div className="bg-background/50 backdrop-blur-sm rounded-lg border shadow-lg h-[calc(100vh-8rem)] overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between gap-3 p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <TodoSection.Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold">Tâches & Notes</h2>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="grid grid-cols-1 h-full">
                    <div className="h-full overflow-hidden">
                      <div className="flex flex-col h-full">
                        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-4 space-y-4 border-b">
                          <TodoInput {...todoProps} />
                          <NotesInput {...noteProps} colors={colors} />
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {todoProps.todos.map((todo) => (
                                <TodoItem
                                  key={todo.id}
                                  todo={todo}
                                  onToggle={todoProps.onToggle}
                                  onDelete={todoProps.onDelete}
                                />
                              ))}
                              {noteProps.notes.map((note) => (
                                <StickyNote
                                  key={note.id}
                                  note={note}
                                  colorClass={`sticky-note-${note.color}`}
                                  onDelete={noteProps.onDelete}
                                />
                              ))}
                            </div>
                            {todoProps.todos.length === 0 && noteProps.notes.length === 0 && (
                              <div className="text-center text-muted-foreground py-12">
                                <p className="text-sm">Aucune tâche ou note pour le moment</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 5:
      return (
        <div key="settings-container" className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <Settings />
          </div>
        </div>
      );
    default:
      return null;
  }
});