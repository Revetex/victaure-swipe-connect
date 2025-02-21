
import { Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface JobsHeaderProps {
  totalJobs: number;
  onRequestAssistant: () => void;
}

export function JobsHeader({ totalJobs, onRequestAssistant }: JobsHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Briefcase className="h-8 w-8 text-primary" />
          <motion.div
            className="absolute -inset-2 bg-primary/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Offres d'emploi
          </h1>
          <p className="text-sm text-zinc-400">
            {totalJobs} offres disponibles
          </p>
        </div>
      </div>

      <Button
        onClick={onRequestAssistant}
        className="group relative overflow-hidden bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/80 text-white shadow-lg transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
        <span>Assistant Victaure IA</span>
      </Button>
    </motion.div>
  );
}
