
import { Logo } from "@/components/Logo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-30 border-b h-14",
      "supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="flex items-center h-full px-4 max-w-[2000px] mx-auto relative z-20">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Logo size={isMobile ? "sm" : "lg"} />
          <h1 className={cn(
            "font-montserrat text-foreground/80",
            "text-base sm:text-lg md:text-xl",
            "bg-gradient-to-br from-foreground/90 via-foreground/80 to-foreground/70",
            "bg-clip-text text-transparent"
          )}>
            {title}
          </h1>
        </motion.div>
      </div>
    </header>
  );
}
