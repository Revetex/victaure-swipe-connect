import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { createEmptyProfile } from "@/types/profile";
import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Coins } from "lucide-react";
import { PricingGrid } from "@/components/pricing/PricingGrid";
interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}
export function DashboardSidebar({
  currentPage,
  onPageChange
}: DashboardSidebarProps) {
  const {
    user
  } = useAuth();
  const {
    profile
  } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const {
    getUnreadCount
  } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  const completeProfile = profile ? {
    ...createEmptyProfile(profile.id, profile.email || ''),
    ...profile
  } : null;
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [getUnreadCount]);

  // Grouper les éléments de navigation par catégorie
  const mainItems = navigationItems.slice(0, 6);
  const networkItems = navigationItems.slice(6, 8);
  const toolsItems = navigationItems.slice(8);
  return <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64">
      
    </div>;
}