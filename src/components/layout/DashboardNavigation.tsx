
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isEditing?: boolean;
}

export function DashboardNavigation({ 
  currentPage, 
  onPageChange,
  isEditing 
}: DashboardNavigationProps) {
  if (isEditing) return null;

  return (
    <div className="hidden">
      {/* This component is kept for backwards compatibility but is no longer used */}
    </div>
  );
}
