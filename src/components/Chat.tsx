
import { useState } from "react";
import { AIAssistant } from "./dashboard/AIAssistant";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { motion, AnimatePresence } from "framer-motion";

export function Chat() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowWelcome(false);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setShowWelcome(true);
  };

  return (
    <AnimatePresence>
      {(showWelcome || showChat) && (
        <>
          {/* Overlay that blocks navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm isolate"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999
            }}
          >
            <div className="h-full w-full flex items-center justify-center p-4">
              {showWelcome && (
                <MrVictaureWelcome 
                  onDismiss={() => setShowWelcome(false)}
                  onStartChat={handleStartChat}
                />
              )}
              
              {showChat && (
                <div className="w-full h-full max-w-4xl mx-auto">
                  <AIAssistant onClose={handleCloseChat} />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
