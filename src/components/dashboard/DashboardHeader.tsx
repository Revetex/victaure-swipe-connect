import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";
import { useState } from "react";

interface DashboardHeaderProps {
  pageTitle: string;
  showFriendsList: boolean;
  isMobile: boolean;
  onFriendsListToggle: () => void;
}

export function DashboardHeader({
  pageTitle,
  showFriendsList,
  isMobile,
  onFriendsListToggle
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

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
                  {pageTitle}
                </h2>
              </div>
              
              <div className="flex-1 max-w-xl mx-4 hidden md:block">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </form>
              </div>
              
              <div className="flex items-center gap-2">
                <NotificationsBox />
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onFriendsListToggle}
                    className="relative"
                  >
                    {showFriendsList ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {isMobile && (
              <div className="px-4 pb-3">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </form>
              </div>
            )}
            
            {isMobile && showFriendsList && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-sm"
              >
                <div className="p-4">
                  <div className="space-y-4">
                    <FriendsContent />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}