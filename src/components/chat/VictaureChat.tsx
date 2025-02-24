
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatMessages } from "./hooks/useChatMessages";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

interface VictaureChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({ 
  maxQuestions = 3, 
  context = "Tu es Mr. Victaure, un assistant spécialisé dans l'emploi. Ta mission principale est de proposer des offres d'emploi pertinentes aux utilisateurs. Ne pose pas trop de questions, concentre-toi sur la présentation d'offres qui correspondent à leurs besoins.",
  onMaxQuestionsReached 
}: VictaureChatProps) {
  const [userInput, setUserInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { 
    messages, 
    isLoading, 
    sendMessage,
    userQuestions,
    error,
    refreshMessages 
  } = useChatMessages({ 
    context: context + " Utilise la recherche web pour trouver des offres d'emploi pertinentes. Propose directement des offres sans poser trop de questions.",
    maxQuestions, 
    user, 
    onMaxQuestionsReached 
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
      const response = await sendMessage(userInput, true);
      setUserInput("");
      
      if (response) {
        speakText(response);
      } else if (error) {
        toast.error("Mr Victaure n'est pas disponible pour le moment. Veuillez réessayer dans quelques instants.");
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  const handleRefresh = () => {
    refreshMessages();
    toast.success("Historique effacé");
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1A1F2C] to-[#151922] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-xl relative backdrop-blur-sm">
      <div className="absolute inset-0 bg-[#64B5D9]/5 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-[#64B5D9]/20">
          <ChatHeader />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-gray-400 hover:text-[#64B5D9] transition-colors"
            title="Effacer l'historique"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <MessageList 
            ref={chatContainerRef} 
            messages={messages}
            isLoading={isLoading}
          />
        </div>
        
        <div className="flex-none bg-[#1A1F2C] border-t border-[#64B5D9]/20 p-4">
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
            webSearchEnabled={true}
          />
        </div>
      </div>
    </div>
  );
}
