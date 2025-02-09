
import { useState } from "react";
import { AIAssistant } from "./dashboard/AIAssistant";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function Chat() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartChat = () => {
    try {
      setShowWelcome(false);
      setShowChat(true);
      setError(null);
    } catch (err) {
      console.error("Error starting chat:", err);
      toast.error("Une erreur est survenue lors du démarrage du chat");
      setError("Erreur de démarrage du chat");
    }
  };

  const handleCloseChat = () => {
    try {
      setShowChat(false);
      setShowWelcome(true);
      setError(null);
    } catch (err) {
      console.error("Error closing chat:", err);
      toast.error("Une erreur est survenue lors de la fermeture du chat");
      setError("Erreur de fermeture du chat");
    }
  };

  return (
    <AnimatePresence>
      {(showWelcome || showChat) && (
        <>
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
              zIndex: 999999
            }}
          >
            <div className="h-full w-full flex items-center justify-center p-8">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-md shadow-lg"
                >
                  {error}
                </motion.div>
              )}
              
              {showWelcome && (
                <MrVictaureWelcome 
                  onDismiss={() => setShowWelcome(false)}
                  onStartChat={handleStartChat}
                />
              )}
              
              {showChat && (
                <div className="w-full h-full max-w-4xl mx-auto pb-8">
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

