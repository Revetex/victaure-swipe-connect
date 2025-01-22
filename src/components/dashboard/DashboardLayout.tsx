import { useState, useEffect } from "react";
import { DashboardNavigation } from "./DashboardNavigation";
import { DashboardContent } from "./DashboardContent";
import { AIAssistant } from "./AIAssistant";
import { motion, AnimatePresence } from "framer-motion";
import { useViewportHeight } from "@/hooks/useViewportHeight";

interface DashboardLayoutProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function DashboardLayout({
  currentPage,
  setCurrentPage,
}: DashboardLayoutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showingChat, setShowingChat] = useState(false);
  const viewportHeight = useViewportHeight();
  const [todoProps, setTodoProps] = useState({
    todos: [],
    onToggle: () => {},
    onDelete: () => {},
    onAdd: () => {},
  });
  const [noteProps, setNoteProps] = useState({
    notes: [],
    onDelete: () => {},
    onAdd: () => {},
  });

  const handleEditStateChange = (state: boolean) => {
    setIsEditing(state);
  };

  const handleRequestChat = () => {
    setShowingChat(true);
  };

  const handleCloseChat = () => {
    setShowingChat(false);
  };

  useEffect(() => {
    // Reset editing state when page changes
    setIsEditing(false);
  }, [currentPage]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pb-24">
        <DashboardContent
          currentPage={currentPage}
          isEditing={isEditing}
          viewportHeight={viewportHeight}
          onEditStateChange={handleEditStateChange}
          onRequestChat={handleRequestChat}
          todoProps={todoProps}
          noteProps={noteProps}
        />
      </div>

      <AnimatePresence>
        {showingChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          >
            <AIAssistant onClose={handleCloseChat} />
          </motion.div>
        )}
      </motion.nav>
      
      <motion.nav 
        className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 transition-all duration-300 safe-area-bottom ${
          !isEditing && !showingChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        }`}
        style={{
          zIndex: 40
        }}
      >
        <DashboardNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </motion.nav>
    </div>
  );
}