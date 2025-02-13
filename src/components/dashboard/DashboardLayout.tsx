
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "@/components/dashboard/content/DashboardContent";
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { UserNav } from "@/components/dashboard/layout/UserNav";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const { profile } = useProfile();

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setIsEditing(false);
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

      <div className="flex-1">
        {/* Header principal */}
        <header className="fixed top-0 right-0 left-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            <div className="lg:hidden">
              <UserNav />
            </div>
            <div className="flex-1 flex justify-center">
              <Logo />
            </div>
            <div className="flex items-center">
              <NotificationsBox />
            </div>
          </div>

          {/* Barre de navigation en dessous du header */}
          <div className="border-t border-border/50">
            <div className="max-w-[2000px] mx-auto px-4">
              <Navigation
                className="flex items-center justify-start gap-4 py-2 overflow-x-auto"
                orientation="horizontal"
              />
            </div>
          </div>
        </header>

        <main className="lg:pl-64 pt-24">
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
