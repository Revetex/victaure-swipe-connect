
import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatMessages } from "./hooks/useChatMessages";
import { useVoiceFeatures } from "./hooks/useVoiceFeatures";
import { Button } from "../ui/button";
import { RefreshCcw, Globe } from "lucide-react";
import { toast } from "sonner";

interface VictaureChatProps {
  maxQuestions?: number;
  context?: string;
  onMaxQuestionsReached?: () => void;
}

export function VictaureChat({ 
  maxQuestions = 3, 
  context = "Tu es Mr. Victaure, un assistant concis et amical. Tu es attentif à l'orthographe et à la grammaire. Donne des réponses courtes et naturelles, en faisant toujours attention à bien écrire les mots.",
  onMaxQuestionsReached 
}: VictaureChatProps) {
  const [userInput, setUserInput] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(false);
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
    context, 
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
      console.log("Sending message to Mr Victaure...");
      const response = await sendMessage(userInput, useWebSearch);
      setUserInput("");
      
      if (response) {
        console.log("Response received:", response);
        speakText(response);
      } else if (error) {
        console.error("Error while sending message:", error);
        toast.error("Mr Victaure n'est pas disponible pour le moment. Veuillez réessayer dans quelques instants.");
      }
    } catch (err) {
      console.error("Error in handleSendMessage:", err);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    }
  };

  const handleRefresh = () => {
    refreshMessages();
    toast.success("Messages rafraîchis");
  };

  const toggleWebSearch = () => {
    setUseWebSearch(!useWebSearch);
    toast.info(useWebSearch ? "Recherche web désactivée" : "Recherche web activée");
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";

  return (
    <div className="w-full bg-gradient-to-b from-[#1A1F2C] to-[#151922] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-xl relative backdrop-blur-sm mt-16">
      <div className="absolute inset-0 bg-[#64B5D9]/5 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#64B5D9]/20">
          <ChatHeader />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleWebSearch}
              className={`transition-colors ${useWebSearch ? 'text-[#64B5D9]' : 'text-gray-400'}`}
              title={useWebSearch ? "Désactiver la recherche web" : "Activer la recherche web"}
            >
              <Globe className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="text-gray-400 hover:text-[#64B5D9] transition-colors"
              title="Rafraîchir les messages"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <MessageList 
          ref={chatContainerRef} 
          messages={messages}
          isLoading={isLoading}
        />
        
        <div className="sticky bottom-0 w-full bg-gradient-to-t from-[#1A1F2C] to-transparent py-2">
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
    </div>
  );
}
