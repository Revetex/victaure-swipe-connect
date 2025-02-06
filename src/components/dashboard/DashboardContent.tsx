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
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  console.error("Content loading error:", error);
  
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

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
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

  const renderContent = () => {
    try {
      switch (currentPage) {
        case 1:
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSkeleton />}>
                <VCard onEditStateChange={onEditStateChange} onRequestChat={onRequestChat} />
              </Suspense>
            </ErrorBoundary>
          );
        case 2:
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSkeleton />}>
                <Messages />
              </Suspense>
            </ErrorBoundary>
          );
        case 3:
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSkeleton />}>
                <Marketplace />
              </Suspense>
            </ErrorBoundary>
          );
        case 4:
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSkeleton />}>
                <Feed />
              </Suspense>
            </ErrorBoundary>
          );
        case 5:
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSkeleton />}>
                <div className="h-full">
                  <NotesMap />
                </div>
              </Suspense>
            </ErrorBoundary>
          );
        case 6:
          return (
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingSkeleton />}>
                <Settings />
              </Suspense>
            </ErrorBoundary>
          );
        default:
          return null;
      }
    } catch (error) {
      console.error("Content rendering error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement du contenu."
      });
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