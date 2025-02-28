
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/header/AppHeader";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#1A1F2C] via-[#1B2A4A] to-[#1A1F2C]"
    >
      <DashboardMobileNav
        currentPage={currentPage}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={handleMobileMenuToggle}
        onPageChange={handlePageChange}
      />

      <main className={cn(
        "flex-1",
        "min-h-screen w-full",
        "relative",
        "ios-safe-area ios-momentum-scroll",
        "bg-gradient-to-br from-[#1A1F2C] via-[#1A1F2C]/95 to-[#1A1F2C]/90",
        "backdrop-blur-sm",
        "border-l border-[#9b87f5]/10",
        "shadow-[inset_0_-20px_60px_-20px_rgba(0,0,0,0.25)]",
        "transition-all duration-300"
      )}>
        <AppHeader 
          onRequestAssistant={handleRequestChat}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={handleMobileMenuToggle}
        />
        
        <div className="h-14" /> {/* Spacer pour le header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full pb-safe p-4 sm:p-6"
        >
          {children || (
            <DashboardContent
              currentPage={currentPage}
              isEditing={isEditing}
              onEditStateChange={handleEditStateChange}
              onRequestChat={handleRequestChat}
            />
          )}
        </motion.div>
      </main>
    </motion.div>
  );
}
