
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { NotificationsBox } from "./notifications/NotificationsBox";
import { UserNav } from "./dashboard/layout/UserNav";
import { Logo } from "./Logo";

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
        </header>

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
