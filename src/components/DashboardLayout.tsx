
import React, { useState, useCallback } from "react";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { DashboardContent } from "./dashboard/DashboardContent";
import { navigationItems } from "@/config/navigation";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion";
import { Connections } from "./Connections";
import { ScrollArea } from "./ui/scroll-area";

export function DashboardLayout() {
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4">
        <Logo />
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  currentPage === item.id && "bg-primary/10"
                )}
                onClick={() => handlePageChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>

        <div className="p-4">
          <Connections />
        </div>
      </ScrollArea>

      {profile && (
        <>
          <Separator />
          <div className="p-4">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {profile.full_name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r fixed h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 z-40 w-full border-b bg-background/80 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center px-4">
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-14 lg:pt-0">
          <DashboardContent
            currentPage={currentPage}
            isEditing={isEditing}
            onEditStateChange={handleEditStateChange}
            onRequestChat={() => handlePageChange(2)}
          />
        </div>
      </main>
    </div>
  );
}
