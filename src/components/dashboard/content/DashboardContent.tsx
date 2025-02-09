
import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/messages/Messages";
import { Feed } from "@/components/feed/Feed";
import { Settings } from "@/components/Settings";
import { NotesPage } from "@/components/tools/NotesPage";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Une erreur est survenue</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-destructive/10 text-destructive px-4 py-2 rounded-md hover:bg-destructive/20 transition-colors"
        >
          Réessayer
        </button>
      </AlertDescription>
    </Alert>
  );
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

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />;
      case 2:
        return <Messages />;
      case 3:
        return <Feed />;
      case 4:
        return <NotesPage />;
      case 5:
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="w-full"
      >
        {renderContent()}
      </motion.div>
    </ErrorBoundary>
  );
}
