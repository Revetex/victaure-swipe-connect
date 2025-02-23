
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RulesDialog } from "../dialogs/RulesDialog";
import { InfoDialog } from "../dialogs/InfoDialog";
import { AlertDialog } from "../dialogs/AlertDialog";
import { Crown } from "lucide-react";

interface LotteryHeaderProps {
  isMobile: boolean;
}

export function LotteryHeader({
  isMobile
}: LotteryHeaderProps) {
  return (
    <div className="relative space-y-6">
      {/* Logo et Titre */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center"
        >
          {/* Logo IMPERIUM */}
          <div className="relative mb-4">
            <div className="absolute inset-0 blur-lg bg-gradient-to-r from-orange-500/30 via-yellow-500/30 to-orange-500/30" />
            <Crown className="h-16 w-16 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
          </div>
          
          {/* Titre avec effet de brillance */}
          <h1 className={cn(
            "text-center font-bold relative",
            "bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-500 bg-clip-text text-transparent",
            "drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]",
            isMobile ? "text-3xl" : "text-4xl sm:text-5xl"
          )}>
            IMPERIUM
            <span className="block text-sm font-normal tracking-widest mt-1 text-white/80">GAMES</span>
          </h1>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-4"
      >
        <RulesDialog />
        <InfoDialog />
        <AlertDialog />
      </motion.div>

      {/* Effet de fond */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c2e] via-[#1a1c2e]/95 to-[#1a1c2e]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)]" />
      </div>
    </div>
  );
}
