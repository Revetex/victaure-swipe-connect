
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
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { TasksPage } from "@/components/tools/TasksPage";

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
  const { user } = useAuth();

  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Application error:", event.error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      toast.error("Une erreur réseau s'est produite. Veuillez vérifier votre connexion.");
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const renderContent = () => {
    // Check authentication
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader className="w-8 h-8" />
        </div>
      );
    }

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
            return <TasksPage />;
          case 8:
            return <CalculatorPage />;
          case 9:
            return <NotificationsTab />;
          case 10:
            return <Settings />;
          default:
            return null;
        }
      } catch (error) {
        console.error("Error rendering content:", error);
        toast.error("Erreur lors du chargement du contenu");
        return (
          <div className="p-4 text-center">
            <p className="text-red-500">Une erreur s'est produite lors du chargement du contenu.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        );
      }
    })();

    return (
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full backdrop-blur-sm bg-background/80 rounded-lg shadow-lg border border-border/50"
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
