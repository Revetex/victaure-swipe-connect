
import { Bot, TrendingUp, Search, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MrVictaureWelcomeProps {
  onDismiss: () => void;
  onStartChat: () => void;
}

export function MrVictaureWelcome({ onDismiss, onStartChat }: MrVictaureWelcomeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <Card className="w-full max-w-lg p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-primary/10">
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="p-3 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="h-8 w-8 text-primary" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold">M. Victaure</h2>
            <p className="text-muted-foreground">Assistant IA pour votre carrière</p>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          <p className="text-lg">
            Bonjour! Je suis M. Victaure, votre assistant de carrière propulsé par l'IA. Je suis là pour :
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Search,
                title: "Recherche d'Emploi",
                description: "Analyse quotidienne des offres d'emploi pertinentes"
              },
              {
                icon: TrendingUp,
                title: "Analyse de Profil",
                description: "Suggestions basées sur vos compétences et expériences"
              },
              {
                icon: Briefcase,
                title: "Orientation Pro",
                description: "Conseils personnalisés pour votre carrière"
              },
              {
                icon: Sparkles,
                title: "Matchmaking",
                description: "Mise en relation avec les meilleures opportunités"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg",
                  "bg-muted/50 hover:bg-muted/80 transition-colors"
                )}
              >
                <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onDismiss}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            Plus tard
          </Button>
          <Button 
            onClick={onStartChat}
            className="bg-primary hover:bg-primary/90"
          >
            Commencer l'orientation
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
