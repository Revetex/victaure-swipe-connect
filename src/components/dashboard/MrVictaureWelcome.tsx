
import { Bot, MessageSquare, BrainCircuit, Sparkles, UserCog, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MrVictaureWelcomeProps {
  onDismiss: () => void;
  onStartChat: () => void;
}

export function MrVictaureWelcome({ onDismiss, onStartChat }: MrVictaureWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const steps = [
    {
      title: "Bienvenue sur Victaure",
      description: "Je suis M. Victaure, votre assistant IA personnel propulsé par Hugging Face. Je suis là pour vous aider dans votre parcours professionnel."
    },
    {
      title: "Votre profil",
      description: "Personnalisez votre profil pour vous connecter avec d'autres professionnels. Ajoutez vos expériences, compétences et préférences."
    },
    {
      title: "Explorez le feed",
      description: "Découvrez le contenu pertinent de votre réseau. Interagissez avec les publications et restez à jour sur les dernières tendances."
    },
    {
      title: "Commencez à discuter",
      description: "Je suis là pour vous aider 24/7. Posez-moi vos questions sur la recherche d'emploi, les tendances du marché ou pour toute assistance."
    }
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartChat();
    }
  };

  const handleStartChat = () => {
    setDismissed(true);
    setTimeout(() => {
      onStartChat();
    }, 300);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          <Card className="w-full max-w-lg p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border border-primary/20 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDismiss}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                className="p-3 rounded-full bg-primary/10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Bot className="h-8 w-8 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: `${((currentStep) / steps.length) * 100}%` }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 mb-6"
            >
              <p className="text-lg">
                {steps[currentStep].description}
              </p>

              {currentStep === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: UserCog,
                      title: "IA Spécialisée",
                      description: "Conseils professionnels basés sur l'intelligence artificielle"
                    },
                    {
                      icon: MessageSquare,
                      title: "Dialogue Intelligent",
                      description: "Conversations naturelles et personnalisées"
                    },
                    {
                      icon: BrainCircuit,
                      title: "Analyse Avancée",
                      description: "Recommandations basées sur vos besoins"
                    },
                    {
                      icon: Sparkles,
                      title: "Support Continu",
                      description: "Disponible 24/7 pour vous accompagner"
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
              )}
            </motion.div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={handleDismiss}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                Ignorer
              </Button>
              <Button 
                onClick={handleNextStep}
                className="bg-primary hover:bg-primary/90 text-primary-foreground group"
              >
                {currentStep < steps.length - 1 ? "Suivant" : "Commencer"}
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
