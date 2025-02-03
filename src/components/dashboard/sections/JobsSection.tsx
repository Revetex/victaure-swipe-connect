import { motion } from "framer-motion";
import { Marketplace } from "@/components/Marketplace";
import { Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function JobsSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">Opportunités Professionnelles</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
              <Info className="h-4 w-4 text-primary" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Découvrez des opportunités adaptées à votre profil et développez votre carrière.
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Trouvez des missions qui correspondent à vos compétences</li>
                <li>Postulez en quelques clics</li>
                <li>Suivez vos candidatures en temps réel</li>
              </ul>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Marketplace />
    </motion.div>
  );
}