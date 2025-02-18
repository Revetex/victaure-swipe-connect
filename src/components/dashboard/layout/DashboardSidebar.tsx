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
import { UserAvatar } from "@/components/UserAvatar";
interface DashboardSidebarProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}
export function DashboardSidebar({
  currentPage,
  onPageChange
}: DashboardSidebarProps) {
  const {
    profile
  } = useProfile();
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  return;
}