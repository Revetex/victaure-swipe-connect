
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { NotesSection } from "@/components/notes/NotesSection";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/ui/loader";
import { NotificationsTab } from "@/components/notifications/NotificationsTab";
import { CalculatorPage } from "@/components/tools/CalculatorPage";
import { ChessSection } from "@/components/tools/ChessSection";
import { TranslatorPage } from "@/components/tools/TranslatorPage";
import { FriendsList } from "@/components/feed/FriendsList";
import { DownloadApp } from "@/components/dashboard/DownloadApp";
import { navigationItems } from "@/config/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface DashboardContentProps {
  currentPage: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  const pageVariants = {
    initial: { 
      opacity: 0,
      y: 20
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 15
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

  const getPageContent = () => {
    // Vérifier si la page existe dans la navigation
    const pageExists = navigationItems.some(item => item.id === currentPage);
    
    if (!pageExists) {
      return (
        <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Page introuvable</AlertTitle>
          <AlertDescription>
            La page que vous recherchez n'existe pas ou n'est plus disponible.
          </AlertDescription>
        </Alert>
      );
    }

    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-4">
            <VCard 
              onEditStateChange={onEditStateChange} 
              onRequestChat={onRequestChat} 
            />
            <DownloadApp />
          </div>
        );
      case 2:
        return <Messages />;
      case 3:
        return <Marketplace />;
      case 4:
        return <Feed />;
      case 7:
        return <ChessSection />;
      case 8:
        return <CalculatorPage />;
      case 9:
        return <NotificationsTab />;
      case 10:
        return <Settings />;
      case 12:
        return <FriendsList />;
      case 14:
        return <TranslatorPage />;
      case 16:
        return <NotesSection />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative bg-background min-h-screen pt-16 pb-20"
    >
      <div className="container mx-auto px-4">
        {getPageContent()}
      </div>
    </motion.div>
  );
}
