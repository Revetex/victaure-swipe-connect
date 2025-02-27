
import { Bot, MessageSquare, BrainCircuit, Sparkles, UserCog, ChevronRight, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

interface MrVictaureWelcomeProps {
  onDismiss: () => void;
  onStartChat: () => void;
}

export function MrVictaureWelcome({ onDismiss, onStartChat }: MrVictaureWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState("welcome");
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [aiResponse, setAiResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const firstName = user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || "Professionnel";

  const steps = [
    {
      title: "Bienvenue sur Victaure",
      description: "Je suis M. Victaure, votre assistant IA personnel. Je suis là pour vous aider dans votre parcours professionnel et répondre à toutes vos questions."
    },
    {
      title: "Développement de carrière",
      description: "Je peux vous aider à explorer de nouvelles opportunités de carrière, analyser les tendances du marché et optimiser votre parcours professionnel."
    },
    {
      title: "Conseils personnalisés",
      description: "Posez-moi des questions sur votre secteur d'activité, vos compétences ou vos objectifs professionnels pour obtenir des conseils adaptés à votre situation."
    },
    {
      title: "Comment puis-je vous aider ?",
      description: "Je suis prêt à vous assister 24/7. Cliquez sur le bouton pour commencer notre conversation et découvrir tout ce que je peux faire pour vous."
    }
  ];

  const simulateTyping = (text: string) => {
    setIsTyping(true);
    setAiResponse("");
    let index = 0;
    const interval = setInterval(() => {
      setAiResponse((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  useEffect(() => {
    if (activeTab === "demo") {
      simulateTyping(`Bonjour ${firstName}! Je suis M. Victaure, votre assistant IA personnel. Je peux vous aider dans divers domaines comme la recherche d'emploi, l'analyse de marché, le développement de compétences, et bien plus encore. Voici quelques exemples de questions que vous pourriez me poser :\n\n• Quelles sont les compétences les plus recherchées dans le secteur tech actuellement?\n• Comment optimiser mon CV pour attirer l'attention des recruteurs?\n• Pouvez-vous me donner des conseils pour la négociation salariale?\n• Quelles sont les tendances du marché dans mon secteur?`);
    }
  }, [activeTab, firstName]);

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
          <Card className="w-full max-w-3xl p-6 bg-[#1E293B]/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl border border-[#64B5D9]/20 relative overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDismiss}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-200 z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger value="welcome">Présentation</TabsTrigger>
                <TabsTrigger value="demo">Démonstration</TabsTrigger>
              </TabsList>

              <TabsContent value="welcome" className="mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="p-3 rounded-full bg-[#64B5D9]/10"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bot className="h-8 w-8 text-[#64B5D9]" />
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white/90">{steps[currentStep].title}</h2>
                    <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#64B5D9]"
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
                  <p className="text-lg text-white/80">
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
                            "bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                          )}
                        >
                          <feature.icon className="h-5 w-5 text-[#64B5D9] mt-0.5" />
                          <div>
                            <h3 className="font-medium text-white/90">{feature.title}</h3>
                            <p className="text-sm text-white/60">{feature.description}</p>
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
                    className="hover:bg-red-500/10 hover:text-red-500 border-white/10 text-white/70"
                  >
                    Ignorer
                  </Button>
                  <Button 
                    onClick={handleNextStep}
                    className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-[#1E293B] group"
                  >
                    {currentStep < steps.length - 1 ? "Suivant" : "Commencer"}
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="demo" className="mt-6">
                <div className="bg-[#242F44] rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10 border-2 border-[#64B5D9]/20">
                      <AvatarImage src="/robot-avatar.png" />
                      <AvatarFallback className="bg-[#64B5D9]/20 text-[#64B5D9]">MV</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white/90">M. Victaure</h3>
                      <p className="text-xs text-white/60">Assistant IA</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#1A2335] rounded p-3 text-white/80 whitespace-pre-line min-h-[200px] max-h-[250px] overflow-y-auto">
                    {aiResponse}
                    {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-[#64B5D9] animate-pulse"></span>}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleDismiss}
                    className="hover:bg-red-500/10 hover:text-red-500 border-white/10 text-white/70"
                  >
                    Plus tard
                  </Button>
                  <Button 
                    onClick={handleStartChat}
                    className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-[#1E293B] group"
                  >
                    Démarrer une conversation
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Effet de particules animées */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#64B5D9]"
                  animate={{
                    x: [Math.random() * 100, Math.random() * 800],
                    y: [Math.random() * 100, Math.random() * 500],
                    opacity: [0, 0.5, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
