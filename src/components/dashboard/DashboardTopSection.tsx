import { useState } from "react";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Connections } from "@/components/Connections";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardTopSectionProps {
  getPageTitle: (page: number) => string;
  currentPage: number;
  isConnectionsOpen: boolean;
  onConnectionsToggle: () => void;
}

export function DashboardTopSection({ 
  getPageTitle, 
  currentPage,
  isConnectionsOpen,
  onConnectionsToggle
}: DashboardTopSectionProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-3 px-4">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <div className="h-6 w-px bg-border mx-2" />
                <h2 className="text-lg font-semibold text-foreground">
                  {getPageTitle(currentPage)}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <NotificationsBox />
              </div>
            </div>
            
            <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Connexions</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onConnectionsToggle}
                    className="hidden sm:flex items-center gap-1"
                  >
                    {isConnectionsOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {isConnectionsOpen && (
                  <div className="space-y-4">
                    <Connections />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}