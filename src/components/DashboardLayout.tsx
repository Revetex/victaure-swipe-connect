import React, { useState } from "react";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardMain } from "./dashboard/layout/DashboardMain";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { useViewport } from "@/hooks/useViewport";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { DashboardAuthCheck } from "./dashboard/layout/DashboardAuthCheck";
import { AnimatePresence } from "framer-motion";
import { getPageTitle } from "@/config/navigation";

export const DashboardLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const { viewportHeight } = useViewport();

  return (
    <DashboardAuthCheck>
      <DashboardContainer>
        <DashboardHeader
          title={getPageTitle(currentPage)}
          showFriendsList={showFriendsList}
          onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
          isEditing={isEditing}
        />
        
        <AnimatePresence>
          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={() => setShowFriendsList(false)}
            />
          )}
        </AnimatePresence>

        <DashboardMain>
          <DashboardContent
            currentPage={currentPage}
            viewportHeight={viewportHeight}
            isEditing={isEditing}
            onEditStateChange={setIsEditing}
            onRequestChat={() => setCurrentPage(2)}
          />
        </DashboardMain>

        <DashboardNavigation
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isEditing={isEditing}
        />
      </DashboardContainer>
    </DashboardAuthCheck>
  );
};