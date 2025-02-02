import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useVCardStyle } from "@/components/vcard/VCardStyleContext";
import { VCardStyleSelector } from "@/components/vcard/VCardStyleSelector";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { selectedStyle } = useVCardStyle();
  const viewportHeight = window.innerHeight;

  const getPageTitle = (pageNumber: number) => {
    switch (pageNumber) {
      case 1:
        return "Profils";
      case 2:
        return "Messages";
      case 3:
        return "Emplois";
      case 4:
        return "Fil d'actualité";
      case 5:
        return "Outils";
      case 6:
        return "Paramètres";
      default:
        return "";
    }
  };

  const handleEditStateChange = (editing: boolean) => {
    setIsEditing(editing);
  };

  const handleRequestChat = () => {
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">VICTAURE</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-lg">{getPageTitle(currentPage)}</span>
        </div>
        <NotificationsBox />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-2">
            <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>

          <div className="lg:col-span-8">
            <DashboardContent
              currentPage={currentPage}
              viewportHeight={viewportHeight}
              isEditing={isEditing}
              onEditStateChange={handleEditStateChange}
              onRequestChat={handleRequestChat}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {currentPage === 1 && !isEditing && (
              <VCardStyleSelector selectedStyle={selectedStyle} />
            )}
            <AIAssistant
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}