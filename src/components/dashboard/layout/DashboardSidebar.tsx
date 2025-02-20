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
    const interval = setInterval(fetchUnreadCount, 30000); // Rafraîchir toutes les 30 secondes

    return () => clearInterval(interval);
  }, [getUnreadCount]);
  return;
}