
import { Logo } from "./Logo";
import { UserNav } from "./UserNav";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const location = useLocation();
  const { profile } = useProfile();
  
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="app-header"
    >
      <div className="flex items-center gap-4">
        <Logo size="sm" />
      </div>

      <div className="flex items-center gap-2">
        <UserNav profile={profile} />
      </div>
    </motion.header>
  );
}
