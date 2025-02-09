
import React, { useState, useCallback } from "react";
import { useViewport } from "@/hooks/useViewport";
import { useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ProfilePreview } from "./ProfilePreview";
import { TranslatorPage } from "./tools/TranslatorPage";
import { Dialog, DialogContent } from "./ui/dialog";
import { Navigation } from "./Navigation";
import { Button } from "./ui/button";
import { DashboardContent } from "./dashboard/DashboardContent";

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
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r hidden lg:block">
        <Navigation />
      </aside>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex h-14 items-center">
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Navigation />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
        </div>
      </header>

      <main className="lg:pl-64">
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
  );
}
