
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";

interface NavigationHeaderProps {
  onShowProfilePreview: () => void;
}

export function NavigationHeader({ onShowProfilePreview }: NavigationHeaderProps) {
  return (
    <div className="h-16 border-b flex items-center justify-between px-4">
      <motion.div 
        className="flex items-center gap-3 group cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={onShowProfilePreview}
      >
        <Logo size="sm" />
      </motion.div>
      <NotificationsBox />
    </div>
  );
}
