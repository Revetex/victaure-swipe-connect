import { motion } from "framer-motion";
import { Settings } from "@/components/Settings";
import { Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function SettingsSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">Paramètres</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
              <Info className="h-4 w-4 text-primary" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p className="text-sm text-muted-foreground">
              Personnalisez votre expérience et gérez vos préférences.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Settings />
    </motion.div>
  );
}