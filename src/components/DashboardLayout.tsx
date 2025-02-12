
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { NotificationsBox } from "./notifications/NotificationsBox";
import { cn } from "@/lib/utils";
import { UserNav } from "./dashboard/layout/UserNav";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

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
    <div className="flex min-h-screen bg-background relative">
      <DashboardSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <main className={cn(
        "flex-1 lg:ml-64 min-h-screen relative",
        "glass-panel"
      )}>
        <header className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:left-64">
          <div className="h-[2px] w-full bg-gradient-to-r from-primary/80 via-secondary/60 to-accent/40" />
          <div className="h-16 border-b border-border/40 px-4">
            <div className="h-full flex items-center justify-between max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden"
                  onClick={() => setShowMobileMenu(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <NotificationsBox />
                <UserNav />
              </div>
            </div>
          </div>
        </header>

        <DashboardMobileNav
          currentPage={currentPage}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          onPageChange={handlePageChange}
        />

        <div className="pt-16">
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
  );
}
