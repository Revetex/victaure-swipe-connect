
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RulesDialog } from "../dialogs/RulesDialog";
import { InfoDialog } from "../dialogs/InfoDialog";
import { AlertDialog } from "../dialogs/AlertDialog";

interface LotteryHeaderProps {
  isMobile: boolean;
}

export function LotteryHeader({ isMobile }: LotteryHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <h1 className={cn(
        "font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent",
        isMobile ? "text-xl" : "text-2xl sm:text-4xl"
      )}>
        Espace Jeux Imperium
      </h1>
      <p className={cn(
        "text-muted-foreground",
        isMobile ? "text-sm" : "text-lg sm:text-xl"
      )}>
        Découvrez nos jeux exceptionnels
      </p>
      
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <RulesDialog />
        <InfoDialog />
        <AlertDialog />
      </div>
    </div>
  );
}
