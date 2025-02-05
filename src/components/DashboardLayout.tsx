import { useIsMobile } from "@/hooks/use-mobile";
import { useState, Suspense, memo } from "react";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useLocation, useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { MainLayout } from "./layout/MainLayout";
import { useViewport } from "@/hooks/useViewport";
import { useNavigation } from "@/hooks/useNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  const { toast } = useToast();

  // Log error to console for debugging
  console.error("Dashboard Error:", error);

  // Show toast notification
  toast({
    variant: "destructive",
    title: "Une erreur est survenue",
    description: "Nous n'avons pas pu charger cette section. Veuillez réessayer."
  });

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

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <ReloadIcon className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const MemoizedDashboardContent = memo(DashboardContent);

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showConversation } = useReceiver();
  const viewportHeight = useViewport();
  const { currentPage, handlePageChange } = useNavigation();

  const handleRequestChat = () => {
    handlePageChange(2);
    navigate('/messages');
  };

  const handleToolReturn = () => {
    navigate('/dashboard');
    handlePageChange(1);
  };

  const getPageTitle = (page: number) => {
    switch (page) {
      case 1:
        return "Profil";
      case 2:
        return "Messages";
      case 3:
        return "Emplois";
      case 4:
        return "Actualités";
      case 5:
        return "Outils";
      case 6:
        return "Paramètres";
      default:
        return "";
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
      switch (currentPage - 1) {
        case 1:
          navigate('/dashboard');
          break;
        case 2:
          navigate('/messages');
          break;
        case 3:
          navigate('/jobs');
          break;
        case 4:
          navigate('/feed');
          break;
        case 5:
          navigate('/tools');
          break;
        case 6:
          navigate('/settings');
          break;
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < 6) {
      handlePageChange(currentPage + 1);
      switch (currentPage + 1) {
        case 1:
          navigate('/dashboard');
          break;
        case 2:
          navigate('/messages');
          break;
        case 3:
          navigate('/jobs');
          break;
        case 4:
          navigate('/feed');
          break;
        case 5:
          navigate('/tools');
          break;
        case 6:
          navigate('/settings');
          break;
      }
    }
  };

  const isInConversation = location.pathname.includes('/messages') && showConversation;
  const isInTools = location.pathname.includes('/tools');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (isInConversation) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="min-h-screen bg-background"
            >
              <MemoizedDashboardContent
                currentPage={currentPage}
                isEditing={isEditing}
                viewportHeight={viewportHeight}
                onEditStateChange={setIsEditing}
                onRequestChat={handleRequestChat}
              />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <MainLayout 
      title={getPageTitle(currentPage)}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      isEditing={isEditing}
      showFriendsList={showFriendsList}
      onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
      onToolReturn={isInTools ? handleToolReturn : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousPage}
          disabled={currentPage <= 1}
          className="w-10 h-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <span className="text-lg font-medium">{getPageTitle(currentPage)}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage >= 6}
          className="w-10 h-10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="transform transition-all duration-300"
              style={{ 
                maxHeight: isEditing ? viewportHeight : 'none',
                overflowY: isEditing ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: isEditing ? `${viewportHeight * 0.2}px` : '10rem'
              }}
            >
              {children || (
                <MemoizedDashboardContent
                  currentPage={currentPage}
                  isEditing={isEditing}
                  viewportHeight={viewportHeight}
                  onEditStateChange={setIsEditing}
                  onRequestChat={handleRequestChat}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
    </MainLayout>
  );
}