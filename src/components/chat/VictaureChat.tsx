
import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { QuickSuggestions } from "./QuickSuggestions";
import { useChatMessages } from "./hooks/useChatMessages";
import { useSuggestions } from "./hooks/useSuggestions";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { Button } from "../ui/button";
import { RefreshCcw, X, Sparkles, Bot, ExternalLink } from "lucide-react";
import { HfInference } from "@huggingface/inference";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface VictaureChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({
  maxQuestions = 3,
  context = "Tu es Mr. Victaure, un assistant intelligent et polyvalent spécialisé dans le domaine professionnel. Tu aides les utilisateurs avec leur carrière, leur recherche d'emploi, et tout autre besoin professionnel. Tu es amical, précis et tu t'adaptes au niveau de l'utilisateur. Tu réponds en français.",
  onMaxQuestionsReached
}: VictaureChatProps) {
  const [userInput, setUserInput] = useState("");
  const [showTips, setShowTips] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const {
    suggestions,
    isLoadingSuggestions,
    generateSuggestions
  } = useSuggestions();
  
  const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
  
  const {
    messages,
    isLoading,
    sendMessage,
    userQuestions,
    error,
    refreshMessages
  } = useChatMessages({
    context,
    maxQuestions,
    user,
    onMaxQuestionsReached,
    hf
  });
  
  const {
    isRecording,
    isSpeaking,
    startRecording,
    speakText,
    setIsSpeaking
  } = useVoiceFeatures();

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    try {
      const message = {
        content: userInput,
        isUser: true,
        timestamp: Date.now()
      };
      const response = await sendMessage(message);
      setUserInput("");
      if (response && !error) {
        speakText(response);
        generateSuggestions(context, messages);
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setUserInput(suggestion);
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Exemples de questions pour Mr. Victaure
  const tipsExamples = [
    "Comment optimiser mon CV pour attirer l'attention des recruteurs?",
    "Quelles sont les compétences les plus recherchées dans le secteur tech?",
    "Pouvez-vous me donner des conseils pour une négociation salariale?",
    "Comment se préparer efficacement à un entretien d'embauche?",
    "Quelles sont les tendances actuelles du marché de l'emploi?",
    "Comment améliorer ma présence professionnelle en ligne?",
    "Quels sont les meilleurs moyens de développer mon réseau professionnel?",
    "Comment gérer efficacement un conflit au travail?"
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] relative overflow-hidden bg-gradient-to-b from-[#1B2A4A]/50 to-[#1A1F2C]/50 backdrop-blur-md rounded-xl border border-[#64B5D9]/20">
      <div className="flex-none border-b border-[#64B5D9]/10">
        <div className="relative flex items-center justify-between">
          <ChatHeader title="Assistant Victaure" />
          <div className="flex items-center gap-2 px-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowTips(!showTips)} 
              className="text-[#F2EBE4]/80 hover:text-[#F2EBE4] transition-colors h-8 w-8" 
              title="Conseils"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={refreshMessages} 
              className="text-[#F2EBE4]/80 hover:text-[#F2EBE4] transition-colors h-8 w-8" 
              title="Effacer l'historique"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onMaxQuestionsReached} 
              className="text-[#F2EBE4]/80 hover:text-[#F2EBE4] transition-colors h-8 w-8" 
              title="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className={cn(
              "m-3 p-4 bg-[#242F44]/80 border-[#64B5D9]/20",
              "text-white/80 text-sm space-y-3"
            )}>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-[#64B5D9]/30">
                  <AvatarImage src="/robot-avatar.png" />
                  <AvatarFallback className="bg-[#64B5D9]/20 text-[#64B5D9]">MV</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-white/90">Exemples de questions</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {tipsExamples.slice(0, 6).map((tip, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto py-2 text-left bg-[#1A2335]/80 border-[#64B5D9]/10 hover:bg-[#1A2335] hover:border-[#64B5D9]/30"
                    onClick={() => {
                      setUserInput(tip);
                      setShowTips(false);
                    }}
                  >
                    <span className="truncate">{tip}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={chatContainerRef} 
        className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#64B5D9]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#64B5D9]/20 p-4"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <Avatar className="h-16 w-16 mx-auto border-2 border-[#64B5D9]/30">
                <AvatarImage src="/robot-avatar.png" />
                <AvatarFallback className="bg-[#64B5D9]/20 text-[#64B5D9] text-xl">MV</AvatarFallback>
              </Avatar>
            </motion.div>
            
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-medium text-white/90"
            >
              Bonjour, je suis M. Victaure
            </motion.h3>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 max-w-md"
            >
              Je suis votre assistant IA spécialisé dans le domaine professionnel. 
              Comment puis-je vous aider aujourd'hui ?
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-white/50 text-sm pt-6"
            >
              <Bot className="h-4 w-4" />
              <span>Alimenté par Hugging Face</span>
              <ExternalLink className="h-3 w-3" />
            </motion.div>
          </div>
        )}
        
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      
      <div className="relative bg-gradient-to-t from-[#1B2A4A]/20 via-[#1B2A4A]/10 to-transparent space-y-3 p-4 pt-2 pb-8 mb-2">
        <QuickSuggestions 
          suggestions={suggestions} 
          isLoading={isLoadingSuggestions} 
          onSelect={handleSuggestionSelect} 
        />
        
        <ChatInput 
          userInput={userInput} 
          setUserInput={setUserInput} 
          isRecording={isRecording} 
          isSpeaking={isSpeaking} 
          isLoading={isLoading} 
          isDisabled={isDisabled} 
          disabledMessage={disabledMessage} 
          onStartRecording={startRecording} 
          onStopSpeaking={() => setIsSpeaking(false)} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
}
