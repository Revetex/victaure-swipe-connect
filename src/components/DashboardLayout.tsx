
import React, { useState, useCallback } from "react";
import { useViewport } from "@/hooks/useViewport";
import { useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardAuthCheck } from "./dashboard/layout/DashboardAuthCheck";
import { DashboardContent } from "./dashboard/DashboardContent";
import { Sheet, SheetContent } from "./ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePreview } from "./ProfilePreview";
import { TranslatorPage } from "./tools/TranslatorPage";
import { Dialog, DialogContent } from "./ui/dialog";
import { DashboardSidebar } from "./dashboard/DashboardSidebar";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const { viewportHeight } = useViewport();
  const location = useLocation();
  const { profile } = useProfile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setIsEditing(false);
    setShowMobileMenu(false);
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  const handleProfileClick = () => {
    if (showTranslator) {
      setShowTranslator(false);
    }
    setShowProfilePreview(true);
  };

  const handleProfileClose = () => {
    setShowProfilePreview(false);
    setShowTranslator(true);
  };

  return (
    <DashboardAuthCheck>
      <div className="min-h-screen bg-background">
        {/* Sidebar pour les grands écrans */}
        <aside className="fixed left-0 top-0 bottom-0 w-72 border-r hidden lg:block">
          <DashboardSidebar 
            currentPage={currentPage}
            profile={profile}
            onPageChange={handlePageChange}
            onProfileClick={handleProfileClick}
          />
        </aside>

        {/* Contenu principal */}
        <main className="lg:pl-72">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container py-6 space-y-8"
            >
              <DashboardContent
                currentPage={currentPage}
                viewportHeight={viewportHeight}
                isEditing={isEditing}
                onEditStateChange={handleEditStateChange}
                onRequestChat={() => handlePageChange(2)}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Profile Preview et menu outils flottant pour les petits écrans */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 lg:hidden">
          {profile && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileClick}
              className="bg-background/95 backdrop-blur-lg shadow-lg rounded-full p-3 border border-border/50"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <Users className="h-10 w-10 text-primary" />
              )}
            </motion.div>
          )}
        </div>

        {profile && (
          <>
            <ProfilePreview
              profile={profile}
              isOpen={showProfilePreview}
              onClose={handleProfileClose}
            />

            <Dialog open={showTranslator} onOpenChange={setShowTranslator}>
              <DialogContent className="max-w-4xl h-[80vh]">
                <TranslatorPage />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </DashboardAuthCheck>
  );
}
