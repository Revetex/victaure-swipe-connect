
import { Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface ConnectionsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ConnectionsSearch({ searchQuery, onSearchChange }: ConnectionsSearchProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative mb-6"
    >
      <div className="relative group">
        <Input
          placeholder="Rechercher une connexion..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-400 focus:border-primary/30 focus:ring-primary/20 transition-all duration-300"
        />
        <Users2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors duration-300" />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
}
