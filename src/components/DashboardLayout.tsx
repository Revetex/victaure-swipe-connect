import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useLocation, useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { MainLayout } from "./layout/MainLayout";
import { useViewport } from "@/hooks/useViewport";
import { useNavigation } from "@/hooks/useNavigation";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

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

  if (isInConversation) {
    return (
      <DashboardContent
        currentPage={currentPage}
        isEditing={isEditing}
        viewportHeight={viewportHeight}
        onEditStateChange={setIsEditing}
        onRequestChat={handleRequestChat}
      />
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
      onToolReturn={handleToolReturn}
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
    </MainLayout>
  );
}