
import { UserPlus2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ConnectionsHeaderProps {
  showPendingRequests: boolean;
  onTogglePendingRequests: () => void;
}

export function ConnectionsHeader({ showPendingRequests, onTogglePendingRequests }: ConnectionsHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-6 border-b border-zinc-800/50"
    >
      <motion.div 
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative">
          <UserPlus2 className="h-6 w-6 text-primary" />
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
        <h2 className="text-xl font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Mes Connexions
        </h2>
      </motion.div>
      <Button
        variant="outline"
        size="sm"
        onClick={onTogglePendingRequests}
        className="hidden sm:flex bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 hover:border-primary/30 transition-all duration-300 group"
      >
        <UserCheck className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
        <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Demandes en attente
        </span>
      </Button>
    </motion.div>
  );
}
