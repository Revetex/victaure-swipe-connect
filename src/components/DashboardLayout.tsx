
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { NotificationsBox } from "./notifications/NotificationsBox";
import { UserNav } from "./dashboard/layout/UserNav";
import { Logo } from "./Logo";

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { profile } = useProfile();

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setIsEditing(false);
    setShowMobileMenu(false);
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Fixed on desktop, sliding on mobile */}
      <DashboardSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header - Fixed at top */}
        <header className="fixed top-0 right-0 left-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-4">
            <Logo className="mr-auto" />
            <NotificationsBox />
            <UserNav />
          </div>
        </header>

        {/* Main Content with correct padding */}
        <main className="lg:pl-64">
          <div className="max-w-7xl mx-auto">
            {children || (
              <DashboardContent
                currentPage={currentPage}
                isEditing={isEditing}
                onEditStateChange={handleEditStateChange}
                onRequestChat={() => handlePageChange(2)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
