
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

  const handleMobileMenuToggle = useCallback((show: boolean) => {
    setShowMobileMenu(show);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <DashboardSidebar 
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Menu mobile avec z-index élevé */}
      <div className="lg:hidden">
        <DashboardMobileNav
          currentPage={currentPage}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={handleMobileMenuToggle}
          onPageChange={handlePageChange}
        />
      </div>

      <main className={cn(
        "flex-1",
        "lg:ml-64",
        "min-h-screen",
        "w-full",
        "relative",
        "ios-safe-area",
        "ios-momentum-scroll"
      )}>
        <AppHeader 
          onRequestAssistant={handleRequestChat}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={handleMobileMenuToggle}
        />
        
        <div className="pt-16 w-full pb-safe">
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
