
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
      <DashboardSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center px-4">
            <div className="mr-4 hidden lg:flex">
              <Logo />
            </div>
            <DashboardMobileNav
              currentPage={currentPage}
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
              onPageChange={handlePageChange}
            />
            <div className="ml-auto flex items-center gap-4">
              <NotificationsBox />
              <UserNav />
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-3.5rem)]">
          {children || (
            <DashboardContent
              currentPage={currentPage}
              isEditing={isEditing}
              onEditStateChange={handleEditStateChange}
              onRequestChat={() => handlePageChange(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
