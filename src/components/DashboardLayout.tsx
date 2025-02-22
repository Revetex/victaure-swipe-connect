
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-screen bg-background w-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5]/10 to-transparent pointer-events-none" />
      
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
        "flex-1 lg:ml-64 min-h-screen p-4 sm:p-6",
        "bg-transparent",
        "border-l border-border/10",
        "relative z-10"
      )}>
        {children || (
          <DashboardContent
            currentPage={currentPage}
            isEditing={isEditing}
            onEditStateChange={handleEditStateChange}
            onRequestChat={() => handlePageChange(2)}
          />
        )}
      </main>
    </div>
  );
}
