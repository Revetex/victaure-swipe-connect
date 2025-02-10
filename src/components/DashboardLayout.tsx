
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardSidebar } from "./dashboard/layout/DashboardSidebar";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1);
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
    <div className={cn(
      "flex min-h-screen bg-background relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-grid-white/10 before:bg-[size:10px_10px] before:[mask-image:radial-gradient(white,transparent_85%)]"
    )}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#8B5CF6,transparent)]"
      />

      {/* Desktop Sidebar */}
      <DashboardSidebar 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Mobile Header */}
      <DashboardMobileNav
        currentPage={currentPage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPageChange={handlePageChange}
      />

      {/* Main Content */}
      <main className={cn(
        "flex-1 lg:ml-64 h-screen relative",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}>
        <div className="h-full flex flex-col pt-14 lg:pt-2">
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
