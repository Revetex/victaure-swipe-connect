
import { useCallback, useState } from "react";
import { DashboardContent } from "../content/DashboardContent";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMobileNav } from "./DashboardMobileNav";
import { AIAssistant } from "../AIAssistant";
import { cn } from "@/lib/utils";

export function DashboardContainer() {
  const [currentPage, setCurrentPage] = useState(4); // Défaut sur l'accueil
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setIsEditing(false);
    setShowMobileMenu(false);
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  const handleRequestChat = useCallback(() => {
    setShowAIAssistant(true);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <DashboardSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <DashboardMobileNav
        currentPage={currentPage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPageChange={handlePageChange}
      />

      <main className={cn(
        "lg:ml-64 min-h-screen",
        "transition-all duration-300 ease-in-out",
        "glass-panel"
      )}>
        <DashboardContent
          currentPage={currentPage}
          isEditing={isEditing}
          onEditStateChange={handleEditStateChange}
          onRequestChat={handleRequestChat}
        />
      </main>

      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}
    </div>
  );
}
