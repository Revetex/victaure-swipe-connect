
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { navigationItems } from "@/config/navigation";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { ProfilePreview } from "@/components/ProfilePreview";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardSidebar({ currentPage, onPageChange }: DashboardSidebarProps) {
  const { profile } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (itemId: number, itemName: string) => {
    onPageChange(itemId);
    // Rediriger vers la page des emplois si l'élément est "Emplois"
    if (itemName === "Emplois") {
      navigate("/jobs");
    }
  };

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="hidden lg:flex flex-col w-64 border-r fixed h-screen glass-panel"
    >
      <div className="p-4">
        <Logo />
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 font-normal",
                  "hover:bg-primary/10 hover:text-primary",
                  currentPage === item.id && "bg-primary/15 text-primary"
                )}
                onClick={() => handleNavigation(item.id, item.name)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {profile && (
        <ProfilePreview
          profile={profile}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </motion.aside>
  );
}
