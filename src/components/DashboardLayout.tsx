import React, { useState, useCallback } from "react";
import { useViewport } from "@/hooks/useViewport";
import { useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Store, Users, PenTool, Settings, Sword, ListTodo, Calculator, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardAuthCheck } from "./dashboard/layout/DashboardAuthCheck";
import { DashboardContent } from "./dashboard/DashboardContent";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { ProfilePreview } from "./ProfilePreview";
import { TranslatorPage } from "./tools/TranslatorPage";
import { Dialog, DialogContent } from "./ui/dialog";

const navigationItems = [
  { id: 1, name: "Tableau de bord", icon: LayoutDashboard },
  { id: 2, name: "Messages", icon: MessageSquare },
  { id: 3, name: "Marketplace", icon: Store },
  { id: 4, name: "Social", icon: Users },
  { id: 5, name: "Notes", icon: PenTool },
  { id: 6, name: "Échecs", icon: Sword },
  { id: 7, name: "Tâches", icon: ListTodo },
  { id: 8, name: "Calculatrice", icon: Calculator },
  { id: 9, name: "Notifications", icon: Bell },
  { id: 10, name: "Paramètres", icon: Settings },
];

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Logo />
      </div>
      <Separator />
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-4 h-12",
                  currentPage === item.id && "bg-primary/10 hover:bg-primary/20"
                )}
                onClick={() => handlePageChange(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>
      </div>
      {profile && (
        <>
          <Separator />
          <div className="p-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProfileClick}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background/80 backdrop-blur border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Users className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{profile.full_name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {profile.role}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}

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

  return (
    <DashboardAuthCheck>
      <div className="min-h-screen bg-background">
        <aside className="fixed left-0 top-0 bottom-0 w-72 border-r hidden lg:block">
          <SidebarContent />
        </aside>

        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
          <div className="container flex h-16 items-center">
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div className="flex-1 flex justify-center">
              <Logo />
            </div>
          </div>
        </header>

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
      </div>
    </DashboardAuthCheck>
  );
}
