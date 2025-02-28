
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle, Brain, Info, Lightbulb, Check, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { useVictaureChat } from "@/hooks/useVictaureChat";
import { QuickSuggestions } from "./QuickSuggestions";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthChatProps {
  maxQuestions?: number;
  context?: string;
}

export function AuthChat({ maxQuestions = 3, context }: AuthChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const { sendMessage, isLoading, messages, questionsLeft } = useVictaureChat({ 
    maxQuestions, 
    context: context || "Je suis l'assistant d'inscription. Je peux vous aider à comprendre les différentes options d'inscription, expliquer les avantages des comptes professionnels et entreprises, et vous guider à travers le processus. Comment puis-je vous aider aujourd'hui ?"
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showGuide, showFaq]);

  // Common questions that users might have during registration
  const commonQuestions = [
    "Quelle est la différence entre un compte professionnel et entreprise ?",
    "Quels sont les avantages de créer un compte ?",
    "Comment fonctionne la vérification de l'email ?",
    "Est-ce que je peux modifier mes informations après l'inscription ?",
    "Quelles informations sont visibles sur mon profil public ?"
  ];

  // Guide steps for registration
  const guideSteps = [
    {
      title: "Choisir votre type de compte",
      description: "Sélectionnez entre compte standard, professionnel ou entreprise selon vos besoins."
    },
    {
      title: "Entrer vos informations",
      description: "Fournissez votre email, créez un mot de passe sécurisé et complétez vos informations personnelles."
    },
    {
      title: "Vérifier votre email",
      description: "Cliquez sur le lien de vérification envoyé à votre adresse email pour activer votre compte."
    },
    {
      title: "Compléter votre profil",
      description: "Ajoutez une photo, vos compétences et votre expérience pour optimiser votre visibilité."
    }
  ];

  return (
    <Card className="flex flex-col h-[420px] bg-gradient-to-br from-[#1B2A4A]/90 to-[#1A1F2C]/90 backdrop-blur-xl rounded-xl border border-[#64B5D9]/20 overflow-hidden shadow-xl mb-8">
      <ChatHeader 
        title={
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#64B5D9]" />
            <span>Assistant d'Inscription</span>
          </div>
        }
        subtitle={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-[#F1F0FB]/70"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {questionsLeft} question{questionsLeft > 1 ? 's' : ''} restante{questionsLeft > 1 ? 's' : ''}
            </span>
          </motion.div>
        }
      />
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#64B5D9]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#64B5D9]/20 p-4 pt-2 space-y-4">
        {/* Guide Section */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="p-3 bg-[#1D2A45] border-[#64B5D9]/20 mb-2">
                <div className="font-medium text-white/90 mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-[#64B5D9]" />
                  Guide d'inscription rapide
                </div>
                <div className="space-y-2">
                  {guideSteps.map((step, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#64B5D9]/20 text-[#64B5D9] flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{step.title}</p>
                        <p className="text-xs text-white/60">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section */}
        <AnimatePresence>
          {showFaq && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="p-3 bg-[#1D2A45] border-[#64B5D9]/20 mb-2">
                <div className="font-medium text-white/90 mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-[#64B5D9]" />
                  Questions fréquentes
                </div>
                <div className="space-y-1">
                  {commonQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left text-white/70 hover:text-white hover:bg-[#64B5D9]/10"
                      onClick={() => {
                        setInputValue(question);
                        setShowFaq(false);
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages List */}
        <MessageList messages={messages} />
            
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-[#64B5D9]/10 rounded-lg border border-[#64B5D9]/20"
          >
            <Info className="w-5 h-5 text-[#64B5D9]" />
            <div>
              <p className="text-sm text-[#F1F0FB]/80">
                Bienvenue ! Je suis là pour vous aider dans votre inscription. N'hésitez pas à me poser vos questions !
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#64B5D9]/10 hover:bg-[#64B5D9]/20 border-[#64B5D9]/30 text-[#F1F0FB]/90"
                  onClick={() => handleSuggestionClick("Quels sont les avantages d'un compte sur Victaure ?")}
                >
                  Avantages de Victaure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#64B5D9]/10 hover:bg-[#64B5D9]/20 border-[#64B5D9]/30 text-[#F1F0FB]/90"
                  onClick={() => handleSuggestionClick("Comment fonctionne l'inscription ?")}
                >
                  Processus d'inscription
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
          
      <div className="p-4 border-t border-[#F1F0FB]/10 space-y-4 bg-[#1B2A4A]/50">
        {/* Helper buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-xs text-[#F1F0FB]/70 hover:text-[#F1F0FB]/90", 
                showGuide && "bg-[#64B5D9]/10 text-[#64B5D9]"
              )}
              onClick={() => setShowGuide(!showGuide)}
            >
              {showGuide ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
              Guide
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-xs text-[#F1F0FB]/70 hover:text-[#F1F0FB]/90", 
                showFaq && "bg-[#64B5D9]/10 text-[#64B5D9]"
              )}
              onClick={() => setShowFaq(!showFaq)}
            >
              {showFaq ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
              FAQ
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#F1F0FB]/70 hover:text-[#F1F0FB]/90"
            onClick={() => window.location.href = '/auth'}
          >
            <Check className="h-3 w-3 mr-1" />
            Prêt à m'inscrire
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez votre question..."
            disabled={isLoading || questionsLeft === 0}
            className="flex-1 bg-[#1A1F2C]/50 border-[#64B5D9]/20 text-[#F1F0FB] placeholder:text-[#F1F0FB]/30 focus:ring-2 focus:ring-[#64B5D9]/30"
          />
          <Button
            type="submit"
            disabled={isLoading || questionsLeft === 0 || !inputValue.trim()}
            className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {questionsLeft === 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-[#F1F0FB]/60 text-center"
          >
            Vous avez atteint la limite de questions. N'hésitez pas à vous inscrire pour continuer la conversation.
          </motion.p>
        )}
      </div>
    </Card>
  );
}
