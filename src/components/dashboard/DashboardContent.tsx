
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { Feed } from "@/components/feed/Feed";
import { ChessPage } from "@/components/tools/ChessPage";
import { useEffect } from "react";
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
  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  // Security: Add error boundary handling
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Application error:", event.error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const renderContent = () => {
    const variants = {
      initial: { 
        opacity: 0, 
        y: 20,
        filter: "blur(10px)"
      },
      animate: { 
        opacity: 1, 
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        filter: "blur(10px)",
        transition: {
          duration: 0.3
        }
      }
    };

    const content = (() => {
      try {
        switch (currentPage) {
          case 1:
            return <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />;
          case 2:
            return <Messages />;
          case 3:
            return <Marketplace />;
          case 4:
            return <Feed />;
          case 5:
            return <NotesMap />;
          case 6:
            return <ChessPage />;
          case 7:
            return <Settings />;
          default:
            return null;
        }
      } catch (error) {
        console.error("Error rendering content:", error);
        toast.error("Erreur lors du chargement du contenu");
        return null;
      }
    })();

    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full backdrop-blur-sm bg-background/80 rounded-lg shadow-lg"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
        {renderContent()}
      </div>
    </div>
  );
}
