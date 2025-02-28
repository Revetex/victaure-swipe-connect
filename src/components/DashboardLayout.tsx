
import React, { useState, useCallback, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContent } from "./dashboard/DashboardContent";
import { DashboardMobileNav } from "./dashboard/layout/DashboardMobileNav";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/header/AppHeader";
import { motion, AnimatePresence } from "framer-motion";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const { profile } = useProfile();

  // Check if it's the user's first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome && profile) {
      setShowWelcomeGuide(true);
      localStorage.setItem("hasSeenWelcome", "true");
    }
  }, [profile]);

  const handleDismissWelcome = useCallback(() => {
    setShowWelcomeGuide(false);
  }, []);

  const handleStartChat = useCallback(() => {
    setShowWelcomeGuide(false);
    setIsAssistantOpen(true);
  }, []);

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

  const contentProps = {
    currentPage,
    isEditing,
    onEditStateChange: handleEditStateChange,
    onRequestChat: handleRequestChat
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen w-full overflow-hidden bg-background"
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
        "ios-safe-area ios-momentum-scroll"
      )}>
        <AppHeader 
          onRequestAssistant={handleRequestChat}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={handleMobileMenuToggle}
        />
        
        <div className="h-16" />
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full pb-safe"
          >
            {children || <DashboardContent {...contentProps} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {showWelcomeGuide && (
        <MrVictaureWelcome
          onDismiss={handleDismissWelcome}
          onStartChat={handleStartChat}
        />
      )}
    </motion.div>
  );
}
