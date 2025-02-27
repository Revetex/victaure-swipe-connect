
import { useState, useEffect } from 'react';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { VictaureChat } from './VictaureChat';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function VictaureChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastOpened, setLastOpened] = useState(Date.now());
  const { user } = useAuth();

  // Simulation de notifications de Mr Victaure
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        // Si le chat n'a pas été ouvert depuis 5 minutes et qu'il n'y a pas déjà une notification
        if (Date.now() - lastOpened > 5 * 60 * 1000 && unreadMessages === 0) {
          setUnreadMessages(prev => prev + 1);
        }
      }, 60 * 1000); // Vérifier toutes les minutes

      return () => clearTimeout(timer);
    }
  }, [isOpen, lastOpened, unreadMessages]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadMessages(0);
    setLastOpened(Date.now());
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-16 right-4 z-50 overflow-hidden shadow-2xl",
              isExpanded ? "w-[90vw] h-[90vh] max-w-4xl" : "w-[350px] h-[550px]"
            )}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <div className="absolute top-1 right-1 flex items-center gap-1 z-10">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full"
                  onClick={toggleExpanded}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <VictaureChat 
                placement="popup" 
                maxQuestions={user ? undefined : 5}
                context="Tu es Mr. Victaure, un assistant intelligent et polyvalent spécialisé dans le domaine professionnel qui aide l'utilisateur avec tous les aspects de l'application. Tu peux l'aider à naviguer, à comprendre les fonctionnalités et à utiliser efficacement la plateforme. Tu réponds en français de manière concise et utile."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="fixed bottom-4 right-4 bg-[#64B5D9] text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
        >
          <Bot className="h-6 w-6" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </motion.button>
      )}
    </>
  );
}
