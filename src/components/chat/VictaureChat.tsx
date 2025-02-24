
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
  context = "Tu es Mr. Victaure, un assistant intelligent et polyvalent. Tu peux discuter de tous les sujets de manière naturelle et engageante. Adapte ton langage au contexte tout en restant professionnel.",
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
    context: useWebSearch ? context + " Tu peux aussi utiliser des informations du web pour répondre de manière précise et factuelle. Assure-toi de bien vérifier les informations avant de répondre." : context,
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
      console.log("Sending message to Mr Victaure with web search:", useWebSearch);
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
    refreshMessages(); // Reset messages when toggling web search
  };

  const isDisabled = userQuestions >= maxQuestions && !user;
  const disabledMessage = "Connectez-vous pour continuer à discuter avec Mr Victaure";

  return (
    <div className="flex flex-col h-[85vh] bg-gradient-to-b from-[#1A1F2C] to-[#151922] rounded-xl overflow-hidden border border-[#64B5D9]/20 shadow-xl relative backdrop-blur-sm">
      <div className="absolute inset-0 bg-[#64B5D9]/5 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-none flex items-center justify-between px-4 py-2 border-b border-[#64B5D9]/20">
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

        <div className="flex-1 overflow-hidden">
          <MessageList 
            ref={chatContainerRef} 
            messages={messages}
            isLoading={isLoading}
          />
        </div>
        
        <div className="flex-none bg-[#1A1F2C] border-t border-[#64B5D9]/20">
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
