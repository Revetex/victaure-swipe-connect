import { useIsMobile } from "@/hooks/use-mobile";
import { useState, Suspense, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { MainLayout } from "./layout/MainLayout";
import { useViewport } from "@/hooks/useViewport";
import { useNavigation } from "@/hooks/useNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardErrorBoundary } from "./dashboard/layout/DashboardErrorBoundary";
import { DashboardLoading } from "./dashboard/layout/DashboardLoading";
import { ConversationLayout } from "./dashboard/layout/ConversationLayout";
import { DashboardContent } from "./dashboard/DashboardContent";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showConversation } = useReceiver();
  const viewportHeight = useViewport();
  const { currentPage, handlePageChange } = useNavigation();

  // Fermer le menu amis quand on change de page
  useEffect(() => {
    setShowFriendsList(false);
  }, [currentPage, location.pathname]);

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

  const isInConversation = location.pathname.includes('/messages') && showConversation;
  const isInTools = location.pathname.includes('/tools');

  if (isInConversation) {
    return (
      <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
        <Suspense fallback={<DashboardLoading />}>
          <ConversationLayout
            currentPage={currentPage}
            isEditing={isEditing}
            viewportHeight={viewportHeight}
            onEditStateChange={setIsEditing}
            onRequestChat={handleRequestChat}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

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
      <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
        <Suspense fallback={<DashboardLoading />}>
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
                <DashboardContent
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