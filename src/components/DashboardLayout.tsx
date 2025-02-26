
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
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
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#F1F0FB] to-[#E5DEFF] dark:from-[#1A1F2C] dark:to-[#1B2A4A] overflow-hidden">
      {/* Menu plein écran pour toutes les tailles */}
      <DashboardMobileNav
        currentPage={currentPage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={handleMobileMenuToggle}
        onPageChange={handlePageChange}
      />

      <main className={cn(
        "flex-1",
        "min-h-screen",
        "w-full",
        "relative",
        "ios-safe-area",
        "ios-momentum-scroll",
        "bg-gradient-to-br from-white/40 via-[#F1F0FB]/30 to-[#E5DEFF]/20",
        "dark:from-[#1A1F2C]/40 dark:via-[#1B2A4A]/30 dark:to-[#222B3D]/20",
        "backdrop-blur-sm",
        "shadow-[inset_0_-20px_60px_-20px_rgba(0,0,0,0.05)]",
        "dark:shadow-[inset_0_-20px_60px_-20px_rgba(0,0,0,0.25)]"
      )}>
        <AppHeader 
          onRequestAssistant={handleRequestChat}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={handleMobileMenuToggle}
        />
        
        <div className="h-16" /> {/* Spacer pour le header */}
        <div className="w-full pb-safe">
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
