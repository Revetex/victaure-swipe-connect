import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { NotesMap } from "@/components/notes/NotesMap";
import { Feed } from "@/components/Feed";
import { useEffect, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-8 w-1/2" />
  </div>
);

export function DashboardContent({
  currentPage,
  viewportHeight,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (currentPage === 5) {
      onEditStateChange(true);
    }
  }, [currentPage, onEditStateChange]);

  const handleError = (error: Error) => {
    console.error("Content loading error:", error);
    toast({
      variant: "destructive",
      title: "Erreur de chargement",
      description: "Impossible de charger le contenu. Veuillez réessayer."
    });
  };

  const renderContent = () => {
    try {
      switch (currentPage) {
        case 1:
          return (
            <Suspense fallback={<LoadingSkeleton />}>
              <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />
            </Suspense>
          );
        case 2:
          return (
            <Suspense fallback={<LoadingSkeleton />}>
              <Messages />
            </Suspense>
          );
        case 3:
          return (
            <Suspense fallback={<LoadingSkeleton />}>
              <Marketplace />
            </Suspense>
          );
        case 4:
          return (
            <Suspense fallback={<LoadingSkeleton />}>
              <Feed />
            </Suspense>
          );
        case 5:
          return (
            <Suspense fallback={<LoadingSkeleton />}>
              <div className="h-full">
                <NotesMap />
              </div>
            </Suspense>
          );
        case 6:
          return (
            <Suspense fallback={<LoadingSkeleton />}>
              <Settings />
            </Suspense>
          );
        default:
          return null;
      }
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {renderContent()}
    </motion.div>
  );
}