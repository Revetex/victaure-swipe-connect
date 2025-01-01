import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MrVictaureWelcomeProps {
  onDismiss: () => void;
  onStartChat: () => void;
}

export function MrVictaureWelcome({ onDismiss, onStartChat }: MrVictaureWelcomeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute bottom-20 right-4 z-50"
    >
      <Card className="p-6 max-w-sm bg-white/95 backdrop-blur-sm shadow-lg border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="p-2 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="h-6 w-6 text-primary" />
          </motion.div>
          <div>
            <h3 className="font-semibold">M. Victaure</h3>
            <p className="text-sm text-muted-foreground">Assistant virtuel</p>
          </div>
        </div>
        <p className="text-sm mb-4">
          Bonjour ! Je suis M. Victaure, votre assistant virtuel de placement professionnel. Je peux vous aider à :
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Optimiser votre profil</li>
            <li>Trouver des opportunités</li>
            <li>Gérer vos candidatures</li>
          </ul>
        </p>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onDismiss}
          >
            Plus tard
          </Button>
          <Button 
            size="sm"
            onClick={onStartChat}
            className="bg-primary hover:bg-primary/90"
          >
            Discuter
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}