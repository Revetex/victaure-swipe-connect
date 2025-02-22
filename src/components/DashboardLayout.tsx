
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/header/AppHeader";

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { profile } = useProfile();

  const handleRequestChat = useCallback(() => {
    setIsAssistantOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setIsEditing(false);
    setShowMobileMenu(false);
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(prev => !prev);
  }, []);

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <DashboardSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Menu mobile avec z-index plus élevé */}
      <div className="fixed inset-0 z-50 lg:hidden">
        <DashboardMobileNav
          currentPage={currentPage}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          onPageChange={handlePageChange}
        />
      </div>

      <main className={cn(
        "flex-1 lg:ml-64",
        "min-h-screen",
        "mt-16",
        "w-full",
        "relative"
      )}>
        <AppHeader 
          onRequestAssistant={handleRequestChat}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
        />
        
        <div className="relative z-0">
          {children || (
            <DashboardContent
              currentPage={currentPage}
              isEditing={isEditing}
              onEditStateChange={handleEditStateChange}
              onRequestChat={handleRequestChat}
            />
          )}
        </div>
      </main>
    </div>
  );
}
