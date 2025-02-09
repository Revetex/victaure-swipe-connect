
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";

export interface AppHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing: boolean;
  onToolReturn?: () => void;
}

export function AppHeader({
  title,
}: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-30 border-b h-14">
      <div className="flex items-center h-full px-4 max-w-[2000px] mx-auto relative z-20">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Logo size="lg" />
          <h1 className="font-montserrat text-base sm:text-lg md:text-xl text-foreground/80">{title}</h1>
        </motion.div>
      </div>
    </header>
  );
}
