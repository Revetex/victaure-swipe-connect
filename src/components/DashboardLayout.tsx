import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useLocation } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { MainLayout } from "./layout/MainLayout";
import { DashboardContainer } from "./layout/DashboardContainer";
import { DashboardNavigation } from "./layout/DashboardNavigation";
import { useViewport } from "@/hooks/useViewport";
import { useNavigation } from "@/hooks/useNavigation";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const { showConversation } = useReceiver();
  const viewportHeight = useViewport();
  const { currentPage, handlePageChange } = useNavigation();

  const handleRequestChat = () => {
    handlePageChange(2);
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
    >
      <DashboardContainer
        viewportHeight={viewportHeight}
        isEditing={isEditing}
        isMobile={isMobile}
      >
        <DashboardContent
          currentPage={currentPage}
          isEditing={isEditing}
          viewportHeight={viewportHeight}
          onEditStateChange={setIsEditing}
          onRequestChat={handleRequestChat}
        />
      </DashboardContainer>
      
      <DashboardNavigation 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isEditing={isEditing}
      />
    </MainLayout>
  );
}